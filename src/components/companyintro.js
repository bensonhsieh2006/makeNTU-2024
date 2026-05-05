import PropTypes from "prop-types";
import React from "react";

const CompanyIntro = ({menus}) => {
    const companyMenu =
    menus !== null && menus !== undefined
      ? menus.find((menu) => menu.type === "company")
      : null;

    return(
      <div>
        {companyMenu !== null && companyMenu !== undefined && (
        <div>
          <h2
            className="text-4xl font-bold text-center text-gray-900"
            data-sal="fade"
            data-sal-easing="ease-in-cubic"
          >
              企業介紹{" "}
          </h2>
          <ul className="flex flex-col items-center gap-6 px-4 py-12 max-w-4xl mx-auto">
            {companyMenu.menuItems.map((item) => (
              <li key={item.id} className="px-6 py-4 w-full max-w-md border-2 rounded-md border-tertiary hover:text-blue-600 hover:border-blue-600 transition-colors duration-200 hover:border-">
                <a 
                  href={`/company_intro/${item.url}`} 
                  className="block text-2xl font-bold text-gray-800 "
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    );
};

CompanyIntro.defaultProps = {
  menus: null,
};

CompanyIntro.propTypes = {
  menus: PropTypes.any,
};

export default CompanyIntro;