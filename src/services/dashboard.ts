import axios from 'axios'

export const getDashBoard = async ()=>{
    try{
        const result = await axios.get("https://dashboard-api-production-ceb7.up.railway.app/dashboardapi/dashboard")
        return result
    } catch(error){
        return error
    }
}