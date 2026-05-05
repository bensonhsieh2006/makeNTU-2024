import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { graphql, Link } from "gatsby";
import "./postListTemplate.css";

export const query = graphql`
  query($slug: String!) {
    contentfulLayout(slug: { eq: $slug }) {
      id
      slug
      title
      description
      contentful_id
      menu {
        name
        type
        menuItems {
          id
          title
          url
        }
      }
      contentModule {
        ... on Node {
          id
        }
      }
    }
    allContentfulLayoutAllPosts(
      sort: { fields: posts___publishDate, order: DESC }
    ) {
      edges {
        node {
          name
          posts {
            id
            slug
            title
            description {
              childMarkdownRemark {
                html
              }
            }
            publishDate(formatString: "MMMM Do, YYYY")
            body {
              childMarkdownRemark {
                excerpt
              }
            }
          }
        }
      }
    }
  }
`;

export default function PostListTemplate({ data, pageContext }) {
  const { currentPage, numPages, limit, skip, slug, backSlug } = pageContext;
  const title = data.contentfulLayout.title;
  const description = data.contentfulLayout.description;
  const menus = data.contentfulLayout.menu;
  const postEdge = data.allContentfulLayoutAllPosts.edges.find((edge) => edge.node.name === slug);
  const posts = postEdge.node.posts;

  return (
    <Layout menus={menus} back={true} backSlug={backSlug}>
      <SEO
        title={title}
        description={description}
        url={process.env.SITE_URL + ((slug === "post") ? `${slug}` : `company_intro/${slug}`)}
      />
      <section id="posts" className="posts section pt-5">
        <div className="container mx-auto" style={{ maxWidth: "1000px" }}>
          {/* <div style={{ display: "flex", alignContent: "center" }}>
                        <button className="material-icons" style={{ fontSize: 45 }}>
                            keyboard_arrow_left
                        </button>
                        <span className="service__title" style={{ fontSize: 25, margin: 0 }}>
                            Return
                        </span>
                    </div> */}
          <h2
            className="section__title text-center mb-16"
            data-sal="fade"
            data-sal-easing="ease-in-cubic"
          >
            {`${title}`}{" "}
            <span style={{ fontWeight: 500, color: "gray", fontSize: 20 }}>
              — {posts.length}{" "}
              Posts
            </span>
          </h2>
          <hr></hr>
          <ul style={{ minHeight: 150, marginBottom: "130px" }}>
            {posts
              .slice(skip, skip + limit)
              .map((node) => (
                <Link to={(slug === "post") ? `/${slug}/${node.slug}` : `/company_intro/${slug}/${node.slug}`}>
                  <li
                    className="postlist"
                    key={node.slug}
                    style={{ marginBottom: 20 }}
                  >
                    <h3
                      className="service__title"
                      style={{ fontWeight: 500, fontSize: 25, marginBottom: 0 }}
                    >
                      {node.title}{" "}
                      <span
                        className="font-medium"
                        style={{ color: "gray", fontSize: 18 }}
                      >
                        — {node.publishDate}
                      </span>
                    </h3>
                    <p
                      className="font-light"
                      style={{ fontSize: 18, marginLeft: 2 }}
                    >
                      {node.body.childMarkdownRemark.excerpt}
                    </p>
                    <hr></hr>
                  </li>
                </Link>
              ))}
          </ul>
          <div
            class="pagination"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Link
                key={`pagination-number${i + 1}`}
                to={i === 0 ? `/${slug}` : `/${slug}/${i + 1}`}
              >
                <div
                  class={i + 1 === currentPage ? "index index-active" : "index"}
                >
                  {i + 1}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
