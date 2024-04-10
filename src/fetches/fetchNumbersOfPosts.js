import { API } from "../constant";

export async function fetchNumbersOfPosts({ courseId, userId }) {

    try {

        const response = await fetch(`${API}/forums?` +
            `populate[posts][populate][autor][fields][0]=username` +
            `&populate[posts][populate][forum_answers][populate][autor][fields][0]=username` +
            `&populate[course][fields][0]=title&filters[course][id]=${courseId}`);

        const { data } = await response.json();

        let totalPosts = 0;
        let postsUsuario = 0;
        let totalRespuestas = 0;
        let respuestasUsuario = 0;

        data.forEach((item) => {
            const esAutor = item.attributes.posts.data.some((post) =>
                post.attributes.autor.data.id === userId);

            totalPosts += item.attributes.posts.data.length;

            postsUsuario += esAutor ? item.attributes.posts.data.filter((post) =>
                post.attributes.autor.data.id === userId).length : 0;

            item.attributes.posts.data.forEach((post) => {
                const length = post.attributes.forum_answers.data.length;
                totalRespuestas += length

                respuestasUsuario += length > 0 ? post.attributes.forum_answers.data.filter((respuesta) =>
                    respuesta.attributes.autor.data.id === userId).length : 0;
            });
        });

        return { totalPosts, postsUsuario, totalRespuestas, respuestasUsuario };

    } catch (error) {
        console.error(error);
    }


}