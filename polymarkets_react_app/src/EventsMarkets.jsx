import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import MarketLiquidity from './Components/Overall Markets/MarketLiquidity';
import MarketVolume from './Components/Overall Markets/MarketVolume';
import MarketVolume24hr from './Components/Overall Markets/MarketVolume24hr';

import SearchBar from './Components/EM Search/SearchBar';
import TotalData from './Components/EM Search/TotalData';

import EventVolume from './Components/EM Search/EventVolume';
import EventLiquidity from './Components/EM Search/EventLiquidity';
import Event24hrVolume from './Components/EM Search/Event24hrVolume';

 
const EventsMarkets = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventSelection = (event) => {
        setSelectedEvent(event.title);  // Log only the title if needed
      };


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

        <div className="bg-body-tertiary">
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
            className="flex-none navbar navbar-vertical navbar-expand-lg navbar-light show vh-lg-100 px-0 py-2 bg-transparent"
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
                href="https://www.pineanalytics.xyz/"
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
                <a href="https://x.com/MattStew_" target="_blank" rel="noopener noreferrer">
                    <div className="avatar avatar-sm text-bg-secondary rounded-circle">
                        <img
                        src={`${process.env.PUBLIC_URL}/twitter_profile.png`}
                        alt="profile twitter"
                        />
                    </div>
                </a>
                </div>
                <div
                className="collapse navbar-collapse overflow-x-hidden"
                id="sidebarCollapse"
                >
                <ul className="navbar-nav">

                    <li className="nav-item my-1">
                        <NavLink
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center rounded-pill ${isActive ? 'active' : ''}`
                        }
                        to="/HomePage"
                        >
                        <i className="bi bi-house-fill" /> <span>Home Page</span>
                        <span className="badge badge-sm rounded-pill me-n2 bg-success-subtle text-success ms-auto" />
                        </NavLink>
                    </li>

                    <li className="nav-item my-1">
                        <NavLink
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center rounded-pill ${isActive ? 'active' : ''}`
                        }
                        to="/market-comparison"
                        >
                        <i class="bi bi-bar-chart-fill"></i> <span>Market Comparison</span>
                        <span className="badge badge-sm rounded-pill me-n2 bg-success-subtle text-success ms-auto" />
                        </NavLink>
                    </li>

                    <li className="nav-item my-1">
                        <NavLink
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center rounded-pill ${isActive ? 'active' : ''}`
                        }
                        to="/events-markets"
                        >
                        <i class="bi bi-search me-2"></i> <span>Search Events</span>
                        <span className="badge badge-sm rounded-pill me-n2 bg-success-subtle text-success ms-auto" />
                        </NavLink>
                    </li>

                </ul>
                
                <hr className="navbar-divider my-5 opacity-70" />  

                 {/* START OF RESROUCES*/}
                 <ul className="navbar-nav">
                    <li>
                        <span className="nav-link text-xs fw-semibold text-uppercase text-muted ls-wide">
                        Resources
                        </span>
                    </li>


                    <li className="nav-item my-1">
                        <a className="nav-link d-flex align-items-center rounded-pill" href="https://www.pineanalytics.xyz/">
                            <img
                                src="/pine_logo.png"
                                alt="Pine Logo 2"
                                style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                            />{" "}
                            <span>Pine Website</span>{" "}
                            <span className="badge badge-sm rounded-pill me-n2 bg-success-subtle text-success ms-auto" />
                        </a>
                    </li>

                    <li className="nav-item my-1">
                        <a
                        className="nav-link d-flex align-items-center rounded-pill"
                        href="https://discord.gg/DdSu5yQMST"
                        >
                            <img 
                                src="/discord_logo.png" 
                                alt="Discord Logo"
                                style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                            /> 
                            <span>Discord</span>{" "}
                        </a>
                    </li>

                    <li className="nav-item my-1">
                        <a className="nav-link d-flex align-items-center rounded-pill" href="https://x.com/PineAnalytics">
                            <img 
                                src="/twitter_logo.png" 
                                alt="Twitter Logo" 
                                style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                            /> 
                            <span>Twitter</span>{" "}
                            <span className="badge badge-sm rounded-pill me-n2 bg-warning-subtle text-warning ms-auto">
                                🔥 Hot
                            </span>
                        </a>
                    </li>

                </ul>
                {/* END OF RESROUCES*/}
                
            </div>
            </div>
            </nav>
            <div className="flex-lg-fill overflow-x-auto ps-lg-1 vstack vh-lg-100 position-relative">
            <div className="d-none d-lg-flex py-3">
                <div className="d-lg-none d-xxl-flex align-items-center gap-4 px-4 scrollable-x">
                <div className="d-flex gap-2 text-xs">
                    
                </div>
                <div className="d-flex gap-2 text-xs">
                
                </div>
                <div className="d-flex gap-2 text-xs">
             
                </div>
                </div>
                <div className="hstack flex-fill justify-content-end flex-nowrap gap-6 ms-auto px-6 px-xxl-8">
                
                
                
                <div className="dropdown">
                    <a
                        className="avatar avatar-sm text-bg-dark rounded-circle"
                        href="https://x.com/MattStew_"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="avatar avatar-sm text-bg-secondary rounded-circle">
                        <img
                            src={`${process.env.PUBLIC_URL}/twitter_profile.png`}
                            alt="profile twitter"
                        />
                        </div>
                    </a>
                    </div>

                </div>
            </div>
            <div className="flex-fill overflow-y-lg-auto scrollbar bg-body rounded-top-4 rounded-top-start-lg-4 rounded-top-end-lg-0 border-top border-lg shadow-2">
                <main className="container-fluid px-3 py-5 p-lg-6 p-xxl-8">
                <div className="mb-6 mb-xl-10">
                    <div className="row g-3 align-items-center">
                    <div className="col">
    
                        <SearchBar onSelectEvent={handleEventSelection}/>

                    </div>
                    <div className="col">
                        
                    </div>
                    </div>
                </div>
                <div className="vstack gap-3 gap-xl-6">
                    
                        {/* OVERALL DATA */}
                        <TotalData event={selectedEvent}/>
                        {/* OVERALL DATA */}

                    <div className="row g-3 g-xl-6">
                    <div className="col-xxl-12">
                        <div className="card">
                        <div className="card-body pb-0">
                            {/* Empty card body */}
                            <EventVolume event={selectedEvent} />
                            
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="row g-3 g-xl-6">
                    <div className="col-xl-6">
                        <div className="card">
                        <div className="card-body pb-3">
                            {/* Empty card body */} 
                            <EventLiquidity event={selectedEvent} />
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card">
                        <div className="card-body pb-3">
                            {/* Empty card body */}
                            <Event24hrVolume event={selectedEvent} />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </main>
            </div>
            </div>
        </div>
        </div>
    </>

  );
};

export default EventsMarkets;
