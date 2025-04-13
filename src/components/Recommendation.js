import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table, TableBody, TableCell, TableContainer, TableFooter,
    TableHead,
    TablePagination, TableRow,
    Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getCountyList } from '../services/ecom';


const countryList = ['USA', 'India', 'Germany', 'Japan'];

const mockUsers = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    totalInvoice: 10000 + i,
    totalProducts: 5000 + i * 3,
    country: countryList[i % countryList.length],
    recommendations: ['Product 1', 'Product 2'],
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPage = (event) => onPageChange(event, 0);
    const handleBack = (event) => onPageChange(event, page - 1);
    const handleNext = (event) => onPageChange(event, page + 1);
    const handleLast = (event) =>
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPage} disabled={page === 0}>
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBack} disabled={page === 0}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNext}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLast}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export default function Recommendation() {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        const loadCountries = async () => {
            const res = await getCountyList();
            if (res.status === 200) {
                console.log(res);
                setCountryList(res.data);
            } else {
                console.error('Failed to load countries:', res);
            }
        };
    
        loadCountries();
    }, []);

    const getCountryList = async () => {
        try {
            const result = await getCountyList()
            setCountryList(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 8));
        setPage(0);
    };

    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - mockUsers.length)
            : 0;

    const visibleRows = rowsPerPage > 0
        ? mockUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : mockUsers;

    return (
        <Box>
            {/* Country Dropdown */}
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        labelId="country-label"
                        value={selectedCountry}
                        label="Country"
                        onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                        {countryList?.map((item) => (
                            <MenuItem key={item.country_name} value={item.country_name}>{item.country_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
                {/* Left - E-Com Users Table */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">E-Com Users</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Total Invoice</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Total Products</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visibleRows.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.totalInvoice}</TableCell>
                                        <TableCell>{user.totalProducts}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" onClick={() => setSelectedUser(user)}>View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={4} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[8, 16, 32]}
                                        count={mockUsers.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                        colSpan={4}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Right - Recommendations */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">ML Recommendation</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Recommended Products</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedUser ? (
                                    selectedUser.recommendations.map((rec, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{rec}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell>Select a user to view recommendations</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
}
