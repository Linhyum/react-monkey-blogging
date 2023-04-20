import React, { useEffect } from "react";
import Layout from "../components/layout/Layout";
import HomeBanner from "../module/home/HomeBanner";
import HomeFeature from "../module/home/HomeFeature";
import HomeNewest from "../module/home/HomeNewest";
import Footer from "../module/footer/Footer";

const HomePage = () => {
    useEffect(() => {
        document.title = "Monkey blogging";
    }, []);
    return (
        <div>
            <Layout>
                <HomeBanner></HomeBanner>
                <HomeFeature></HomeFeature>
                <HomeNewest></HomeNewest>
                <Footer></Footer>
            </Layout>
        </div>
    );
};

export default HomePage;
