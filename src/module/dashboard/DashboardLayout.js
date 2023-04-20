import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/auth-context";

const DashboardStyles = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    .dashboard {
        &-heading {
            font-weight: bold;
            font-size: 36px;
            /* margin-bottom: 40px; */
            color: ${(props) => props.theme.primary};
            letter-spacing: 1px;
        }
        &-main {
            display: grid;
            padding: 40px 20px;
            gap: 0 40px;
            align-items: start;
        }
    }
    @media screen and (min-width: 1280px) {
        .dashboard-main {
            grid-template-columns: 280px minmax(0, 1fr);
        }
    }
`;
const DashboardLayout = ({ children }) => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    //nếu chưa đăng nhập thì k vô được Dashboard
    if (!userInfo) {
        navigate("/sign-in");
    }
    return (
        <DashboardStyles>
            <DashboardHeader></DashboardHeader>
            <div className="dashboard-main grid-cols-1">
                <Sidebar></Sidebar>
                <div className="dashboard-children">
                    <Outlet></Outlet>
                </div>
            </div>
        </DashboardStyles>
    );
};

export default DashboardLayout;
