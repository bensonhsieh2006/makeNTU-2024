import { useStaticQuery, Link, graphql, navigate } from "gatsby";
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Header = ({ menus, back, backSlug }) => {
  const sQData = useStaticQuery(graphql`
    query {
      allContentfulLayoutHeader {
        edges {
          node {
            title
          }
        }
      }
    }
  `);

  const headerData = sQData.allContentfulLayoutHeader.edges[0].node;

  let navMenuButton, navMenu;

  const mainMenu =
    menus !== null && menus !== undefined
      ? menus.find((menu) => menu.type === "primary")
      : null;

  const initSmoothScroll = () => {
    if (typeof window !== "undefined") {
      const SmoothScroll = require("smooth-scroll");

      const scroll = new SmoothScroll('a[href*="#"]', {
        speed: 800,
        speedAsDuration: true,
        easing: "easeOutQuart",
      });
    }
  };

  const toggleNav = () => {
    navMenu.classList.toggle("nav__menu--active");

    navMenuButton.classList.toggle("nav__menu-button--active");

    document.body.classList.toggle("disable-scroll");
  };

  const closeMenu = () => {
    if (navMenuButton.classList.contains("nav__menu-button--active")) {
      navMenuButton.classList.remove("nav__menu-button--active");

      navMenu.classList.remove("nav__menu--active");

      document.body.classList.remove("disable-scroll");
    }
  };

  useEffect(() => {
    navMenuButton = document.getElementById("nav_menu_button");

    navMenu = document.getElementById("nav_menu");

    initSmoothScroll();
  });

  return (
    <header className="header">
      {back ? (
        <button
          className="material-icons"
          style={{ fontSize: 45 }}
          onClick={() => {
            // console.log(window.location.pathname);
            if (window.location.pathname.startsWith("/post/")  
            ) {
              navigate("/post");
            } else if (window.location.pathname.startsWith("/company_intro/")
            ) {
              if (backSlug !== "company_intro"){
                navigate(`/company_intro/${backSlug}`);
              }
              else{
                navigate("/company_intro");
              }
            } else {
              navigate("/");
            }
          }}
        >
          keyboard_arrow_left
        </button>
      ) : null}
      <Link to="/">
        <div style={{ display: "flex", alignItem: "center", margin: "4px" }}>
          <img
            src={require("assets/images/favicon2025.png")}
            style={{ maxHeight: "50px" }}
          />
          <h1 className="header header__title">{headerData.title}</h1>
        </div>
      </Link>
      {mainMenu !== null && mainMenu !== undefined && (
        <nav className="nav">
          <h2 className="hidden">Top navigation</h2>
          <ul id="nav_menu" className="nav__menu">
            {mainMenu.menuItems.map((item) => (
              <li key={item.id}>
                <a href={item.url} onClick={closeMenu}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <button
            id="nav_menu_button"
            className="nav__menu-button"
            aria-label="mobile menu"
            onClick={toggleNav}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      )}
    </header>
  );
};

Header.defaultProps = {
  menus: null,
};

Header.propTypes = {
  menus: PropTypes.any,
};

export default Header;
