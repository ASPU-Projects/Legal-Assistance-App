import React from "react";

export const HeaderSection = ({ text }: { text: String }) => {
  return <h2 className="text-center my-6 text-3xl font-bold text-[var(--clr-product)]">{text}</h2>;
};
