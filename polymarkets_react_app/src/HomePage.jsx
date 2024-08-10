import React from 'react';
import Chart1 from './Components/Chart1'; 
import TotalDataComponent from './Components/Overall Markets/TotalDataComponent';
import VolumeChart from './Components/Popular Markets/VolumeChart'; 
import LiquidityChart from './Components/Popular Markets/LiquidityChart'; 
import SpreadChart from './Components/Popular Markets/SpreadChart'; 
import BarVolumeChart from './Components/Popular Markets/BarVolumeChart'; 
import MarketLiquidity from './Components/Overall Markets/MarketLiquidity';

const HomePage = () => {
  return (
    <>
        <meta charSet="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <meta name="color-scheme" content="dark light" />
        <title>Satoshi – Web3 and Finance Dashboard Theme</title>
        <link rel="stylesheet" type="text/css" href="../css/main.css" />
        <link rel="stylesheet" type="text/css" href="../css/utility.css" />
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css"
        />
        <link
            rel="stylesheet"
            href="https://api.fontshare.com/v2/css?f=satoshi@900,700,500,300,401,400&display=swap"
        />
        <div
            className="modal fade"
            id="depositLiquidityModal"
            tabIndex={-1}
            aria-labelledby="depositLiquidityModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
                <div className="modal-header pb-0 border-0">
                <h1 className="modal-title h4" id="depositLiquidityModalLabel">
                    Deposit liquidity
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
                </div>
                <div className="modal-body undefined">
                <form className="vstack gap-6">
                    <div className="vstack gap-1">
                    <div className="bg-body-secondary rounded-3 p-4">
                        <div className="d-flex justify-content-between text-xs text-muted">
                        <span className="fw-semibold">From</span>{" "}
                        <span>Balance: 10,000 ADA</span>
                        </div>
                        <div className="d-flex justify-content-between gap-2 mt-4">
                        <input
                            type="tel"
                            className="form-control form-control-flush text-xl fw-bold flex-fill"
                            placeholder={0.0}
                        />{" "}
                        <button className="btn btn-neutral shadow-none rounded-pill flex-none d-flex align-items-center gap-2 py-2 ps-2 pe-4">
                            <img
                            src="../../img/crypto/color/ada.svg"
                            className="w-rem-6 h-rem-6"
                            alt="..."
                            />{" "}
                            <span className="text-xs fw-semibold text-heading ms-1">
                            ADA
                            </span>
                        </button>
                        </div>
                    </div>
                    <div className="position-relative text-center my-n4 overlap-10">
                        <div className="icon icon-sm icon-shape bg-body shadow-soft-3 rounded-circle text-sm text-body-tertiary">
                        <i className="bi bi-arrow-down-up" />
                        </div>
                    </div>
                    <div className="bg-body-secondary rounded-3 p-4">
                        <div className="d-flex justify-content-between text-xs text-muted">
                        <span className="fw-semibold">To</span>{" "}
                        <span>Balance: 0 SUN</span>
                        </div>
                        <div className="d-flex justify-content-between gap-2 mt-4">
                        <input
                            type="tel"
                            className="form-control form-control-flush text-xl fw-bold flex-fill"
                            placeholder={0.0}
                        />{" "}
                        <button className="btn btn-neutral shadow-none rounded-pill flex-none d-flex align-items-center gap-2 py-2 ps-2 pe-4">
                            <img
                            src="../../img/pools/pool-1.png"
                            className="w-rem-6 h-rem-6 rounded-circle"
                            alt="..."
                            />{" "}
                            <span className="text-xs fw-semibold text-heading ms-1">
                            SUN
                            </span>
                        </button>
                        </div>
                    </div>
                    </div>
                    <div>
                    <label className="form-label">Slippage tolerance</label>
                    <div className="d-flex flex-wrap gap-1 gap-sm-2">
                        <div className="w-sm-56 input-group input-group-sm input-group-inline">
                        <input
                            type="search"
                            className="form-control"
                            placeholder={1}
                        />{" "}
                        <span className="input-group-text">%</span>
                        </div>
                        <div className="flex-fill">
                        <input
                            type="radio"
                            className="btn-check"
                            name="options"
                            id="option1"
                            defaultChecked="checked"
                        />{" "}
                        <label
                            className="btn btn-sm btn-neutral w-100"
                            htmlFor="option1"
                        >
                            0.5%
                        </label>
                        </div>
                        <div className="flex-fill">
                        <input
                            type="radio"
                            className="btn-check"
                            name="options"
                            id="option2"
                            defaultChecked="checked"
                        />{" "}
                        <label
                            className="btn btn-sm btn-neutral w-100"
                            htmlFor="option2"
                        >
                            1%
                        </label>
                        </div>
                        <div className="flex-fill">
                        <input
                            type="radio"
                            className="btn-check"
                            name="options"
                            id="option3"
                            defaultChecked="checked"
                        />{" "}
                        <label
                            className="btn btn-sm btn-neutral w-100"
                            htmlFor="option3"
                        >
                            3%
                        </label>
                        </div>
                    </div>
                    </div>
                    <button type="button" className="btn btn-primary w-100">
                    Provide liquidity
                    </button>
                </form>
                </div>
            </div>
            </div>
        </div>
        <div
            className="modal fade"
            id="connectWalletModal"
            tabIndex={-1}
            aria-labelledby="connectWalletModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
                <div className="modal-header pb-0 border-0">
                <h1 className="modal-title h4" id="connectWalletModalLabel">
                    Connect your wallet
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
                </div>
                <div className="modal-body undefined">
                <div className="list-group list-group-flush gap-2">
                    <div className="list-group-item border rounded d-flex gap-3 p-4 bg-body-secondary-hover">
                    <div className="icon flex-none">
                        <img
                        src="../../img/wallets/metamask.png"
                        className="w-rem-8 h-rem-8"
                        alt="..."
                        />
                    </div>
                    <div className="d-flex align-items-center flex-fill">
                        <div>
                        <a
                            href="#"
                            className="stretched-link text-heading text-sm fw-bold"
                        >
                            MetaMask
                        </a>
                        </div>
                        <div className="ms-auto">
                        <span className="badge badge-md text-bg-primary">
                            Popular
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="list-group-item border rounded d-flex gap-3 p-4 bg-body-secondary-hover">
                    <div className="icon flex-none">
                        <img
                        src="../../img/wallets/coinbase.webp"
                        className="w-rem-8 h-rem-8"
                        alt="..."
                        />
                    </div>
                    <div className="d-flex align-items-center flex-fill">
                        <div>
                        <a
                            href="#"
                            className="stretched-link text-heading text-sm fw-bold"
                        >
                            Coinbase Wallet
                        </a>
                        </div>
                    </div>
                    </div>
                    <div className="list-group-item border rounded d-flex gap-3 p-4 bg-body-secondary-hover">
                    <div className="icon flex-none">
                        <img
                        src="../../img/wallets/walletconnect.png"
                        className="w-rem-8 h-rem-8"
                        alt="..."
                        />
                    </div>
                    <div className="d-flex align-items-center flex-fill">
                        <div>
                        <a
                            href="#"
                            className="stretched-link text-heading text-sm fw-bold"
                        >
                            WalletConnect
                        </a>
                        </div>
                    </div>
                    </div>
                    <div className="list-group-item border rounded d-flex gap-3 p-4 bg-body-secondary-hover">
                    <div className="icon flex-none">
                        <img
                        src="../../img/wallets/phantom.png"
                        className="w-rem-8 h-rem-8"
                        alt="..."
                        />
                    </div>
                    <div className="d-flex align-items-center flex-fill">
                        <div>
                        <a
                            href="#"
                            className="stretched-link text-heading text-sm fw-bold"
                        >
                            Phantom
                        </a>
                        </div>
                        <div className="ms-auto">
                        <span className="badge badge-md text-bg-light">Solana</span>
                        </div>
                    </div>
                    </div>
                    <div className="list-group-item border rounded d-flex gap-3 p-4 bg-body-secondary-hover">
                    <div className="icon flex-none">
                        <img
                        src="../../img/wallets/core.png"
                        className="w-rem-8 h-rem-8"
                        alt="..."
                        />
                    </div>
                    <div className="d-flex align-items-center flex-fill">
                        <div>
                        <a
                            href="#"
                            className="stretched-link text-heading text-sm fw-bold"
                        >
                            Core
                        </a>
                        </div>
                        <div className="ms-auto">
                        <span className="badge badge-md text-bg-light">
                            Avalanche
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="list-group-item border rounded d-flex gap-3 p-4 bg-body-secondary-hover">
                    <div className="icon flex-none">
                        <img
                        src="../../img/wallets/glow.svg"
                        className="w-rem-8 h-rem-8"
                        alt="..."
                        />
                    </div>
                    <div className="d-flex align-items-center flex-fill">
                        <div>
                        <a
                            href="#"
                            className="stretched-link text-heading text-sm fw-bold"
                        >
                            Glow
                        </a>
                        </div>
                        <div className="ms-auto">
                        <span className="badge badge-md text-bg-light">Solana</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="text-xs text-muted mt-6">
                    By connecting wallet, you agree to Satoshi's{" "}
                    <a href="#" className="fw-bold">
                    Terms of Service
                    </a>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div className="d-flex flex-column flex-lg-row h-lg-100 gap-1">
            <nav
            className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light bg-transparent show vh-lg-100 px-0 py-2"
            id="sidebar"
            >
            <div className="container-fluid px-3 px-md-4 px-lg-6">
                <button
                className="navbar-toggler ms-n2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarCollapse"
                aria-controls="sidebarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon" />
                </button>{" "}
                <a
                className="navbar-brand d-inline-block py-lg-1 mb-lg-5"
                href="/pages/dashboard.html"
                >
                <img
                    src="/pine_logo.png"
                    className="logo-dark h-rem-8 h-rem-md-10"
                    alt="Pine Logo"
                />{" "}
                <img
                    src="/pine_logo.png"
                    className="logo-light h-rem-8 h-rem-md-10"
                    alt="Pine Logo"
                />
                </a>
                <div className="navbar-user d-lg-none">
                <div className="dropdown">
                    <a
                    className="d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="false"
                    aria-expanded="false"
                    >
                    <div>
                        <div className="avatar avatar-sm text-bg-secondary rounded-circle">
                        AE
                        </div>
                    </div>
                    <div className="d-none d-sm-block ms-3">
                        <span className="h6">Alexis</span>
                    </div>
                    <div className="d-none d-md-block ms-md-2">
                        <i className="bi bi-chevron-down text-muted text-xs" />
                    </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                    <div className="dropdown-header">
                        <span className="d-block text-sm text-muted mb-1">
                        Signed in as
                        </span>{" "}
                        <span className="d-block text-heading fw-semibold">
                        Alexis Enache
                        </span>
                    </div>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-house me-3" />
                        Home{" "}
                    </a>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-pencil me-3" />
                        Edit profile
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-gear me-3" />
                        Settings{" "}
                    </a>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-image me-3" />
                        Media{" "}
                    </a>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-box-arrow-up me-3" />
                        Share
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-person me-3" />
                        Login
                    </a>
                    </div>
                </div>
                </div>
                <div
                className="collapse navbar-collapse overflow-x-hidden"
                id="sidebarCollapse"
                >
                <ul className="navbar-nav">
                    <li className="nav-item my-1">
                    <a
                        className="nav-link d-flex align-items-center rounded-pill active"
                        href="#sidebar-dashboards"
                        data-bs-toggle="collapse"
                        role="button"
                        aria-expanded="true"
                        aria-controls="sidebar-dashboards"
                    >
                        <i className="bi bi-house-fill" /> <span>Dashboards</span>{" "}
                        <span className="badge badge-sm rounded-pill me-n2 bg-success-subtle text-success ms-auto" />
                    </a>
                    <div className="collapse show" id="sidebar-dashboards">
                        <ul className="nav nav-sm flex-column mt-1">
                        <li className="nav-item">
                            <a href="/pages/dashboard.html" className="nav-link">
                            Default
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                            href="/pages/dashboard-analytics.html"
                            className="nav-link fw-bold"
                            >
                            Analytics
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/pages/dashboard-wallet.html" className="nav-link">
                            Wallet
                            </a>
                        </li>
                        </ul>
                    </div>
                    </li>
                </ul>
                <hr className="navbar-divider my-5 opacity-70" />  
            </div>
            </div>
            </nav>
            <div className="flex-lg-fill overflow-x-auto ps-lg-1 vstack vh-lg-100 position-relative">
            <div className="d-none d-lg-flex py-3">
                <div className="flex-none">
                <div className="input-group input-group-sm input-group-inline w-rem-64 rounded-pill">
                    <span className="input-group-text rounded-start-pill">
                    <i className="bi bi-search me-2" />{" "}
                    </span>
                    <input
                    type="search"
                    className="form-control ps-0 rounded-end-pill"
                    placeholder="Search"
                    aria-label="Search"
                    />
                </div>
                </div>
                <div className="d-lg-none d-xxl-flex align-items-center gap-4 px-4 scrollable-x">
                <div className="d-flex gap-2 text-xs">
                    
                </div>
                <div className="d-flex gap-2 text-xs">
                
                </div>
                <div className="d-flex gap-2 text-xs">
             
                </div>
                </div>
                <div className="hstack flex-fill justify-content-end flex-nowrap gap-6 ms-auto px-6 px-xxl-8">
                <button
                    type="button"
                    className="btn btn-xs btn-primary rounded-pill text-nowrap"
                    data-bs-target="#connectWalletModal"
                    data-bs-toggle="modal"
                >
                    Connect
                </button>
                <div className="dropdown d-none">
                    <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    <i className="bi bi-sun-fill" />
                    </a>
                    <div className="dropdown-menu">
                    <button
                        type="button"
                        className="dropdown-item d-flex align-items-center"
                        data-bs-theme-value="light"
                    >
                        Light
                    </button>{" "}
                    <button
                        type="button"
                        className="dropdown-item d-flex align-items-center"
                        data-bs-theme-value="dark"
                    >
                        Dark
                    </button>{" "}
                    <button
                        type="button"
                        className="dropdown-item d-flex align-items-center"
                        data-bs-theme-value="auto"
                    >
                        System
                    </button>
                    </div>
                </div>
                <div className="dropdown">
                    <a
                    href="#"
                    className="nav-link"
                    id="dropdown-notifications"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    <i className="bi bi-bell" />
                    </a>
                    <div
                    className="dropdown-menu dropdown-menu-end px-2"
                    aria-labelledby="dropdown-notifications"
                    >
                    <div className="dropdown-item d-flex align-items-center">
                        <h6 className="dropdown-header px-0">Notifications</h6>
                        <a href="#" className="text-sm fw-semibold ms-auto">
                        Clear all
                        </a>
                    </div>
                    <div className="dropdown-item py-3 d-flex">
                        <div>
                        <div className="avatar bg-primary text-white rounded-circle">
                            RF
                        </div>
                        </div>
                        <div className="flex-fill ms-3">
                        <div className="text-sm lg-snug w-rem-64 text-wrap">
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Robert
                            </a>{" "}
                            sent a message to{" "}
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Webpixels
                            </a>
                        </div>
                        <span className="text-muted text-xs">30 mins ago</span>
                        </div>
                    </div>
                    <div className="dropdown-item py-3 d-flex">
                        <div>
                        <img
                            src="../../img/people/img-1.jpg"
                            className="avatar rounded-circle"
                            alt="..."
                        />
                        </div>
                        <div className="flex-fill ms-3">
                        <div className="text-sm lg-snug w-rem-64 text-wrap">
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Robert
                            </a>{" "}
                            sent a message to{" "}
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Webpixels
                            </a>
                        </div>
                        <span className="text-muted text-xs">30 mins ago</span>
                        </div>
                    </div>
                    <div className="dropdown-item py-3 d-flex">
                        <div>
                        <img
                            src="../../img/people/img-2.jpg"
                            className="avatar rounded-circle"
                            alt="..."
                        />
                        </div>
                        <div className="flex-fill ms-3">
                        <div className="text-sm lg-snug w-rem-64 text-wrap">
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Robert
                            </a>{" "}
                            sent a message to{" "}
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Webpixels
                            </a>
                        </div>
                        <span className="text-muted text-xs">30 mins ago</span>
                        </div>
                    </div>
                    <div className="dropdown-item py-3 d-flex">
                        <div>
                        <div className="avatar bg-success text-white rounded-circle">
                            KW
                        </div>
                        </div>
                        <div className="flex-fill ms-3">
                        <div className="text-sm lg-snug w-rem-64 text-wrap">
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Robert
                            </a>{" "}
                            sent a message to{" "}
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Webpixels
                            </a>
                        </div>
                        <span className="text-muted text-xs">30 mins ago</span>
                        </div>
                    </div>
                    <div className="dropdown-item py-3 d-flex">
                        <div>
                        <img
                            src="../../img/people/img-4.jpg"
                            className="avatar rounded-circle"
                            alt="..."
                        />
                        </div>
                        <div className="flex-fill ms-3">
                        <div className="text-sm lg-snug w-rem-64 text-wrap">
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Robert
                            </a>{" "}
                            sent a message to{" "}
                            <a
                            href="#"
                            className="fw-semibold text-heading text-primary-hover"
                            >
                            Webpixels
                            </a>
                        </div>
                        <span className="text-muted text-xs">30 mins ago</span>
                        </div>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="dropdown-item py-2 text-center">
                        <a
                        href="#"
                        className="fw-semibold text-muted text-primary-hover"
                        >
                        View all
                        </a>
                    </div>
                    </div>
                </div>
                <div className="dropdown">
                    <a
                    className="avatar avatar-sm text-bg-dark rounded-circle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="false"
                    aria-expanded="false"
                    >
                    <img src="/img/memoji/memoji-1.svg" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                    <div className="dropdown-header">
                        <span className="d-block text-sm text-muted mb-1">
                        Signed in as
                        </span>{" "}
                        <span className="d-block text-heading fw-semibold">
                        Alexis Enache
                        </span>
                    </div>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-house me-3" />
                        Home{" "}
                    </a>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-pencil me-3" />
                        Edit profile
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-gear me-3" />
                        Settings{" "}
                    </a>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-image me-3" />
                        Media{" "}
                    </a>
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-box-arrow-up me-3" />
                        Share
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" href="#">
                        <i className="bi bi-person me-3" />
                        Login
                    </a>
                    </div>
                </div>
                </div>
            </div>
            <div className="flex-fill overflow-y-lg-auto scrollbar bg-body rounded-top-4 rounded-top-start-lg-4 rounded-top-end-lg-0 border-top border-lg shadow-2">
                <main className="container-fluid px-3 py-5 p-lg-6 p-xxl-8">
                <div className="mb-6 mb-xl-10">
                    <div className="row g-3 align-items-center">
                    <div className="col">
                        <h1 className="ls-tight">Polymarkets Data</h1>
                    </div>
                    <div className="col">
                        <div className="hstack gap-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-sm btn-neutral d-none d-sm-inline-flex"
                            data-bs-target="#depositLiquidityModal"
                            data-bs-toggle="modal"
                        >
                            <span className="pe-2">
                            <i className="bi bi-plus-circle" />{" "}
                            </span>
                            <span>Liquidity</span>
                        </button>{" "}
                        <a
                            href="/pages/page-overview.html"
                            className="btn d-inline-flex btn-sm btn-dark"
                        >
                            <span>Trade</span>
                        </a>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="vstack gap-3 gap-xl-6">
                    
                        {/* OVERALL DATA */}
                        <TotalDataComponent />
                        {/* OVERALL DATA */}

                    <div className="row g-3 g-xl-6">
                    <div className="col-xxl-12">
                        <div className="card">
                        <div className="card-body pb-0">
                            {/* Empty card body */}
                            <MarketLiquidity id="chartPop-top" />
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="row g-3 g-xl-6">
                    <div className="col-xl-6">
                        <div className="card">
                        <div className="card-body pb-3">
                            {/* Empty card body */} 
                            <LiquidityChart id="chart-left" />
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card">
                        <div className="card-body pb-0">
                            {/* Empty card body */}
                            <SpreadChart id="chart1-right" />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </main>
            </div>
            </div>
        </div>
    </>

  );
};

export default HomePage;
