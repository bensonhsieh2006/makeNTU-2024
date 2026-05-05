const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const layoutTemplate = path.resolve(`src/templates/pageTemplate.js`);
  const postTemplate = path.resolve(`src/templates/postTemplate.js`);
  const postListTemplate = path.resolve(`src/templates/postListTemplate.js`);
  return graphql(`
    query {
      allContentfulLayout {
        edges {
          node {
            slug
            menu {
              menuItems {
                url
              }
            }
          }
        }
      }
      allContentfulLayoutAllPosts {
        edges {
          node {
            name
            posts {
              title
              slug
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      throw result.errors;
    }
    result.data.allContentfulLayout.edges.forEach((edge) => {
      if (edge.node.slug === "404") {
        // for 404 page we use custom page at src/pages/404.js
        return;
      } else if (edge.node.slug === "/") {
        createPage({
          path: edge.node.slug,
          component: layoutTemplate,
          context: {
            slug: edge.node.slug,
            back: false,
          },
        });
      } else if (edge.node.slug === "post") {
        const postEdge =
          result.data.allContentfulLayoutAllPosts.edges.find((edge) => edge.node.name == "post");
        const posts = postEdge.node.posts;
        const postsPerPage = 5;
        const numPages = Math.ceil(posts.length / postsPerPage);
        Array.from({ length: numPages }).forEach((_, i) => {
          createPage({
            path: i === 0 ? edge.node.slug : `${edge.node.slug}/${i + 1}`,
            component: postListTemplate,
            context: {
              slug: "post",
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1,
            },
          });
        });
      } else if (edge.node.slug === "company_intro") {
        createPage({
          path: edge.node.slug,
          component: layoutTemplate,
          context:{
            slug: edge.node.slug,
            back: true,
          }
        });

        const companyMenuItems = edge.node.menu[0].menuItems;
        companyMenuItems.forEach((menuItem) => {
          const companySlug = menuItem.url;
          const companyEdge = result.data.allContentfulLayoutAllPosts.edges.find((edge) => edge.node.name == companySlug);
          const posts = companyEdge.node.posts;
          const postsPerPage = 5;
          const numPages = Math.ceil(posts.length / postsPerPage);

          Array.from({ length: numPages }).forEach((_, i) => {
            createPage({
              path: i === 0 ? `/company_intro/${companySlug}` : `/company_intro/${companySlug}/${i + 1}`,
              component: postListTemplate,
              context: {
                backSlug: "company_intro",
                slug: companySlug,
                limit: postsPerPage,
                skip: i * postsPerPage,
                numPages,
                currentPage: i + 1,
              },
            })
          });

          posts.forEach(
            (post) => {
              createPage({
                path: `/company_intro/${companySlug}/${post.slug}`,
                component: postTemplate,
                context: {
                  slug: post.slug,
                  layoutSlug: companySlug,
                },
              });
            }
          );
        })
      };
    });

    postEdge = result.data.allContentfulLayoutAllPosts.edges.find((edge) => edge.node.name == "post");
    postEdge.node.posts.forEach(
      (post) => {
        createPage({
          path: `/post/${post.slug}`,
          component: postTemplate,
          context: {
            slug: post.slug,
            layoutSlug: "post",
          },
        });
      }
    );

    
  });
};
