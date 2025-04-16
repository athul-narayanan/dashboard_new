import axios from 'axios'

export interface EcomUserRequest {
    country: string;
    page: number;
}

// Recommendation System
export const getCountyList = async () => {
    try {
        const result = await axios.get("https://dashboard-api-production-ceb7.up.railway.app/dashboardapi/ecom/country/")
        return result
    } catch (error) {
        return error
    }
}

export const getRecommendations = async (country: string, userId: number) => {
    try {
        const response = await axios.get('https://dashboard-api-production-ceb7.up.railway.app/dashboardapi/ecom/recommend/', {
            params: {
                country,
                user_id: userId,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};

export const getEcomUsers = async (params: EcomUserRequest) => {
    try {
        const response = await axios.post('https://dashboard-api-production-ceb7.up.railway.app/dashboardapi/ecom/user/', params);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch ecom users:', error);
        throw error;
    }
};
