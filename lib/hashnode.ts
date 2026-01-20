
const HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com";
const USERNAME = "vinitshah"; // Defaulting to user's likely username

export async function getHashnodePosts() {
  const query = `
    query GetUserArticles($host: String!) {
      publication(host: $host) {
        posts(first: 20) {
          edges {
            node {
              id
              title
              brief
              slug
              coverImage {
                url
              }
              publishedAt
              readTimeInMinutes
              url
              reactionCount
              responseCount
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(HASHNODE_GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          host: `${USERNAME}.hashnode.dev`, // Assuming standard hashnode subdomain
        },
      }),
      cache: 'no-store', // Always fetch fresh data
    });

    const { data } = await response.json();

    // Fallback if the subdomain doesn't work (try personal domain logic later if needed)
    if (!data?.publication) {
      console.error("Hashnode publication not found.");
      return [];
    }

    return data.publication.posts.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      excerpt: node.brief,
      slug: node.slug,
      url: node.url,
      image: node.coverImage?.url || "",
      date: new Date(node.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      readTime: `${node.readTimeInMinutes} min read`,
      category: "Tech", // Hashnode posts might have tags, but for now generic
      reactionCount: node.reactionCount || 0,
      responseCount: node.responseCount || 0,
    }));
  } catch (error) {
    console.error("Error fetching Hashnode posts:", error);
    return [];
  }
}

export async function getHashnodePost(slug: string) {
  const query = `
    query GetPost($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          subtitle
          content {
            html
          }
          coverImage {
            url
          }
          publishedAt
          readTimeInMinutes
          url
          reactionCount
          responseCount
          author {
            name
            profilePicture
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(HASHNODE_GQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          host: `${USERNAME}.hashnode.dev`,
          slug,
        },
      }),
      cache: 'no-store',
    });

    const { data } = await response.json();
    return data?.publication?.post || null;
  } catch (error) {
    console.error("Error fetching Hashnode post:", error);
    return null;
  }
}

export async function getHashnodeComments(postId: string) {
  const query = `
    query GetPostComments($postId: ID!) {
      post(id: $postId) {
        comments(first: 50) {
          edges {
            node {
              id
              content {
                html
              }
              author {
                name
                profilePicture
              }
              dateAdded
              totalReactions
              replies(first: 10) {
                edges {
                  node {
                    id
                    content {
                      html
                    }
                    author {
                      name
                      profilePicture
                    }
                    dateAdded
                    totalReactions
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(HASHNODE_GQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { postId },
      }),
      cache: 'no-store',
    });

    const { data } = await response.json();

    if (!data?.post?.comments?.edges) {
      return [];
    }

    return data.post.comments.edges.map(({ node }: any) => ({
      id: node.id,
      content: node.content?.html || "",
      author: {
        name: node.author?.name || "Anonymous",
        avatar: node.author?.profilePicture || "",
      },
      dateAdded: node.dateAdded,
      totalReactions: node.totalReactions || 0,
      replies: node.replies?.edges?.map(({ node: reply }: any) => ({
        id: reply.id,
        content: reply.content?.html || "",
        author: {
          name: reply.author?.name || "Anonymous",
          avatar: reply.author?.profilePicture || "",
        },
        dateAdded: reply.dateAdded,
        totalReactions: reply.totalReactions || 0,
      })) || [],
    }));
  } catch (error) {
    console.error("Error fetching Hashnode comments:", error);
    return [];
  }
}

