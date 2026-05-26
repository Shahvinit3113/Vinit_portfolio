

async function run() {
    const response = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: '{ publication(host: "vinitshah.hashnode.dev") { posts(first: 1) { edges { node { title } } } } }'
        })
    });
    console.log(response.status);
    console.log(await response.text());
}
run();
