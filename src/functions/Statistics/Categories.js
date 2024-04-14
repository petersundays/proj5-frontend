export const CategoriesList = async (token) => {

    const getCategories = "http://localhost:8080/backend_proj5_war_exploded/rest/categories/list";

    try {
        const response = await fetch(getCategories, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: token
            }
        });

        if (response.ok) {
            const categories = await response.json();
            return categories;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
    }
}