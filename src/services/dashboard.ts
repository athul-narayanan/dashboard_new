import axios from 'axios'

export const getDashBoard = async ()=>{
    try{
        const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/dashboard`)
        return result
    } catch(error){
        return error
    }
}