import React from "react";
import { Link } from "react-router-dom";
import ReactDom from "react-dom";
const Footer = () => {
    return ReactDom.createPortal(
        <footer className="bg-slate-800 text-white footer">
            <div className="container mx-auto py-8 px-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="">
                        <h3 className="text-lg font-bold mb-2">About Us</h3>
                        <p className="text-white">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis
                            bibendum gravida.{" "}
                        </p>
                    </div>
                    <div className="">
                        <h3 className="text-lg font-bold mb-2">Latest Posts</h3>
                        <ul className="text-white leading-normal list-none">
                            <li>
                                <Link to="#">Lorem ipsum dolor sit amet</Link>
                            </li>
                            <li>
                                <Link to="#">Consectetur adipiscing elit</Link>
                            </li>
                            <li>
                                <Link to="#">Sed do eiusmod tempor incididunt</Link>
                            </li>
                            <li>
                                <Link to="#">Ut labore et dolore magna aliqua</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="">
                        <h3 className="text-lg font-bold mb-2">Popular Categories</h3>
                        <ul className="text-white leading-normal list-none">
                            <li>
                                <Link to="#">Lorem ipsum dolor sit amet</Link>
                            </li>
                            <li>
                                <Link to="#">Consectetur adipiscing elit</Link>
                            </li>
                            <li>
                                <Link to="#">Sed do eiusmod tempor incididunt</Link>
                            </li>
                            <li>
                                <Link to="#">Ut labore et dolore magna aliqua</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="">
                        <h3 className="text-lg font-bold mb-2">Follow Us</h3>
                        <div className="flex gap-x-4 mt-2">
                            <Link to="#">
                                <i className="fab fa-facebook-square fa-2x text-white"></i>
                            </Link>
                            <Link to="#">
                                <i className="fab fa-twitter-square fa-2x text-white"></i>
                            </Link>
                            <Link to="#">
                                <i className="fab fa-instagram-square fa-2x text-white"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>,
        document.querySelector("body")
    );
};
export default Footer;
