import axios from "axios";

class UserService{
    static BASE_URL = "http://localhost:1010"

    static async login(email, password){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email, password})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData, token){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async updateUser(userId, userData, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
 static async getAllCategories(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/api/v1/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
/*************  ✨ Codeium Command ⭐  *************/
    /**
     * Gets all categories from the server.
     * @param {string} token - the authentication token to use for the request
     * @returns {Promise<Object[]>} - a promise that resolves to an array of category objects
     * @throws {Error} - if there is an error making the request


/******  70b7a57f-9f63-4f6c-a87d-d10d5dce1218  *******/
    static async getAllBlog(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/api/v1/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
    static async createCategory(categoryData, token) {
            try {
                const response = await axios.post(
                    `${UserService.BASE_URL}/adminuser/api/v1/categories`,
                    {
                        categoryTitle: categoryData.categoryTitle,
                        categoryDescription: categoryData.categoryDescription
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                return response;
            } catch (err) {
                throw err;
            }
        }
     static async createBlog(blogFormData, token) {
            try {
                // Log authentication information for debugging
                console.log("Using authorization header:", `Bearer ${token.substring(0, 10)}...`);
                
                const response = await axios.post(
                    `${UserService.BASE_URL}/adminuser/api/v1/category/posts`,
                    blogFormData, // Send FormData directly
                    {
                        headers: {
                            
                            Authorization: `Bearer ${token}`,
                            
                            // Don't set Content-Type when sending FormData - axios will set it correctly with boundary
                        },
                    }
                );
                
                console.log('Blog created successfully:', response.data);
                return response;
            } catch (error) {
                console.error("Error creating blog:", error.response ? error.response.data : error.message);
                // Add more detailed error logging
                if (error.response) {
                    console.error("Response status:", error.response.status);
                    console.error("Response headers:", error.response.headers);
                }
                throw error;
            }
        }
 static async deleteCategory(categoryId, token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/adminuser/api/v1/categories/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
    /**AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }

}

export default UserService;