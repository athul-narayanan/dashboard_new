import axios from 'axios'

export const getDashBoard = async ()=>{
    try{
        const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/dashboard`)
        return result
    } catch(error){
        return error
    }
}

export const triggerGemini = async (question: string, filetype: string)=>{
    try{
        const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/dashboard/ask`, {
            question,
            filetype
        })
        return result.data
    }catch(error){
        return error
    }
}