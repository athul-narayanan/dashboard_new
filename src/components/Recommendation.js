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
    Button
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getCountyList, getEcomUsers, getRecommendations } from '../services/ecom';

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
        const [recommendations, setRecommendations] = useState([]);


    const [page, setPage] = useState(0); // 0-indexed
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [countryList, setCountryList] = useState([]);
    const [userData, setUserData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const loadCountries = async () => {
            const res = await getCountyList();
            if (res.status === 200) {
                setCountryList(res.data);
            }
        };
        loadCountries();
    }, []);

    useEffect(() => {
        if (selectedCountry) fetchUsers();
    }, [selectedCountry, page, rowsPerPage]);

    const fetchUsers = async () => {
        try {
            const res = await getEcomUsers({
                country: selectedCountry,
                page: page + 1
            });
            setUserData(res.results);
            setTotalCount(res.count);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                        onChange={(e) => {
                            setSelectedCountry(e.target.value);
                            setPage(0);
                            setSelectedUser(null);
                            setRecommendations([]);
                        }}
                    >
                        {countryList.map((item) => (
                            <MenuItem key={item.country_name} value={item.country_name}>
                                {item.country_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 4 }}>
                {/* Left - E-Com Users Table */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ marginBottom: '8px' }}>E-Com Users</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Customer ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Total Invoice</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Total Products</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userData.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.customer_id}</TableCell>
                                        <TableCell>{user.invoice_count}</TableCell>
                                        <TableCell>{user.product_count}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={async () => {
                                                    setSelectedUser(user);
                                                    console.log(user);
                                                    try {
                                                        const res = await getRecommendations(user.country, user.customer_id);
                                                        setRecommendations(res.recommended_products);
                                                    } catch (error) {
                                                        setRecommendations([]);
                                                    }
                                                }}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[]}
                                        count={totalCount}
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
                    <Typography variant="h6" sx={{ marginBottom: '8px' }}>ML Recommendation</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Recommended Products {selectedUser && recommendations.length > 0 ? 'For Customer_Id ' + selectedUser.customer_id : '' }</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedUser && recommendations.length > 0 ? (
                                    recommendations.map((rec, idx) => (
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
