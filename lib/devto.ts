const DEVTO_API_ENDPOINT = "https://dev.to/api";
const USERNAME = "vinitshah"; // Assuming default username based on profile

export async function getDevtoPosts() {
  try {
    const response = await fetch(`${DEVTO_API_ENDPOINT}/articles/latest?username=${USERNAME}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Dev.to API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    return data.map((post: any) => ({
      id: post.id.toString(),
      title: post.title,
      excerpt: post.description,
      slug: post.slug,
      url: post.url,
      image: post.cover_image || post.social_image || "",
      date: new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      readTime: `${post.reading_time_minutes} min read`,
      category: "Tech",
      reactionCount: post.public_reactions_count || 0,
      responseCount: post.comments_count || 0,
      series: post.collection_id ? {
        id: post.collection_id.toString(),
        name: "Collection", // Dev.to API doesn't return collection name directly in article list
        slug: "collection",
      } : null,
    }));
  } catch (error) {
    console.error("Error fetching Dev.to posts:", error);
    return [];
  }
}

export async function getDevtoPost(slug: string) {
  try {
    const response = await fetch(`${DEVTO_API_ENDPOINT}/articles/${USERNAME}/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Dev.to API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    return {
      id: data.id.toString(),
      title: data.title,
      subtitle: data.description,
      content: {
        html: data.body_html,
      },
      coverImage: {
        url: data.cover_image || data.social_image || "",
      },
      publishedAt: data.published_at,
      readTimeInMinutes: data.reading_time_minutes,
      url: data.url,
      reactionCount: data.public_reactions_count || 0,
      responseCount: data.comments_count || 0,
      author: {
        name: data.user?.name || "Vinit Shah",
        profilePicture: data.user?.profile_image || "",
      },
    };
  } catch (error) {
    console.error("Error fetching Dev.to post:", error);
    return null;
  }
}

export async function getDevtoComments(postId: string) {
  try {
    const response = await fetch(`${DEVTO_API_ENDPOINT}/comments?a_id=${postId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Dev.to API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    return data.map((comment: any) => ({
      id: comment.id_code,
      content: comment.body_html || "",
      author: {
        name: comment.user?.name || "Anonymous",
        avatar: comment.user?.profile_image || "",
      },
      dateAdded: comment.created_at,
      totalReactions: 0, // Dev.to API doesn't expose comment reactions directly in this endpoint
      replies: comment.children?.map((reply: any) => ({
        id: reply.id_code,
        content: reply.body_html || "",
        author: {
          name: reply.user?.name || "Anonymous",
          avatar: reply.user?.profile_image || "",
        },
        dateAdded: reply.created_at,
        totalReactions: 0,
      })) || [],
    }));
  } catch (error) {
    console.error("Error fetching Dev.to comments:", error);
    return [];
  }
}
