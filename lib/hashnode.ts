
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
