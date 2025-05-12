import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    return {
        // make sure the `await` happens at the end, otherwise we
        // can't start loading comments until we've loaded the post
        // comments: loadComments(params.slug),
        // post: await loadPost(params.slug)
        docs: [
        ]

    };
};
