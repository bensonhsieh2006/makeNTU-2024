import React, { useEffect, useState, useRef } from "react";
import Img from "gatsby-image";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { graphql, Link } from "gatsby";
import ReactPlayer from "react-player";
import Glider from "glider-js";
import "templates/postTemplate.css";
import { Minimize } from "@material-ui/icons";

export const query = graphql`
  query PostBySlug($slug: String!, $layoutSlug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulPost(slug: { eq: $slug }) {
      title
      description {
        description
      }
      slug
      publishDate(formatString: "MMMM Do, YYYY")
      heroImage {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
      files {
        file {
          fileName
          url
        }
      }
      videoUrl
      contentImages {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid
        }
      }
    }
    contentfulLayout(slug: { eq: $layoutSlug }) {
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
    }
  }
`;

export default function PostTemplate({ data, pageContext }) {
  const { layoutSlug } = pageContext;
  const post = data.contentfulPost;
  const title = post.title;
  const description = post.description.description;
  const files = post.files;
  const contentImages = post.contentImages;
  const [gliderIndex, setGliderIndex] = useState(0);

  const initSlider = () => {
    new Glider(document.querySelector(".glider1"), {
      slidesToShow: 1,
      scrollLock: true,
      duration: 1.2,
      dots: ".glider1__dots",
      draggable: true,
      arrows: {
        prev: ".glider1-prev",
        next: ".glider1-next",
      },
    });
  };

  let slideTimeout = null;
  let nextIndexRef = useRef(gliderIndex);
  nextIndexRef.current = gliderIndex;
  function sliderAuto(slider, miliseconds) {
    const slidesCount = slider.track.childElementCount;

    function slide() {
      slideTimeout = setTimeout(function () {
        console.log(nextIndexRef.current);
        if (nextIndexRef.current >= slidesCount) {
          slider.scrollItem(0);
          setGliderIndex((index) => {
            console.log(index);
            return 0;
          });
        } else {
          slider.scrollItem(nextIndexRef.current + 1);
          setGliderIndex((index) => {
            console.log(index);
            return index + 1;
          });
        }
      }, miliseconds);
    }

    slider.ele.addEventListener("glider-animated", function () {
      window.clearInterval(slideTimeout);
      slide();
    });

    slide();
  }
  useEffect(() => {
    if (contentImages) {
      window.onload = function () {
        //console.log("refresh");
        const glider1 = Glider(document.querySelector(".glider1"));

        sliderAuto(glider1, 4000);
      };
    }
  }, []);
  useEffect(() => {
    if (contentImages) {
      initSlider();
    }
  });

  const handleClickLeft = () => {
    setGliderIndex(gliderIndex - 1);
  };

  const handleClickRight = () => {
    setGliderIndex(gliderIndex + 1);
  };

  return (
    <Layout menus={null} back={true} backSlug={layoutSlug}>
      <SEO
        title={title}
        description={description}
        url={process.env.SITE_URL + ((layoutSlug === "post") ? `post/${post.slug}` : `company_intro/${layoutSlug}/${post.slug}`)}
      />
      <div>
        <div
          className="heroImage-container container section mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <Img
            className="heroImage"
            alt={post.title}
            fluid={post.heroImage.fluid}
          />
        </div>

        <div
          className="post container section mx-auto mb-20"
          style={{ maxWidth: "1000px" }}
        >
          <h2 className="w-full font-medium text-4xl leading-none mb-0">
            {post.title}
          </h2>
          <p className="font-normal mb-3" style={{ color: "gray" }}>
            {post.publishDate}
          </p>
          {contentImages ? (
            <div>
              <div
                className="contentImage-container container mx-auto"
                style={{ maxWidth: "800px" }}
              >
                <div className="contentImage__slider">
                  <div className="glider1" id="glider1">
                    {contentImages.map((image) => {
                      return (
                        <Img
                          className="contentImage"
                          alt={image.title}
                          fluid={image.fluid}
                        />
                      );
                    })}
                  </div>
                  <div style={{ width: "80%", transform: "translateX(12%)" }}>
                    <button
                      className="glider1-prev material-icons"
                      style={{
                        position: "absolute",
                        left: "0px",
                      }}
                      onClick={handleClickLeft}
                    >
                      keyboard_arrow_left
                    </button>
                    <button
                      className="glider1-next material-icons"
                      style={{ position: "absolute", right: "0px" }}
                      onClick={handleClickRight}
                    >
                      keyboard_arrow_right
                    </button>
                  </div>
                  <div
                    className="glider1__dots"
                    style={{ marginBottom: "30px" }}
                  ></div>
                </div>
              </div>
            </div>
          ) : null}
          <div
            className="post-body"
            dangerouslySetInnerHTML={{
              __html: post.body.childMarkdownRemark.html,
            }}
          />
          <br></br>
          {post.videoUrl && (
            <div>
              {post.videoUrl.map((url) => (
                <div className="video-container">
                  <ReactPlayer
                    url={url}
                    className="video"
                    width="min(90vw, 640px)"
                  />
                </div>
              ))}
            </div>
          )}
          {files ? (
            <div>
              <hr></hr>
              <p className="text-2xl text-bold mb-5">文章附件：</p>
              <div className="file-container">
                {files.map((file) => {
                  var url = file.file.url;
                  try {
                    if (url.slice(0, 2) === "//") {
                      url = `https:${url}`;
                    } else if (url.slice(0, 4) === "http") {
                    } else {
                      throw new Error(`Invalid file download URL: '${url}'`);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                  return (
                    <Link to={url}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <i
                          className="material-icons text-primary text-4xl"
                          style={{ textAlign: "center" }}
                        >
                          sim_card_download
                        </i>
                        <p
                          style={{
                            textAlign: "center",
                            wordWrap: "break-word",
                          }}
                        >
                          {file.file.fileName}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
