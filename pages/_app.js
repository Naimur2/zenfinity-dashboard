import React from "react";
import App from "next/app";
import Head from "next/head";

import "../styles/globals.scss";
import Layout from "./layout/layout";

class Zenfinity extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <Head>
          <title>Zenfinity</title>
          <link rel="shortcut icon" href="/favicon.png" sizes="any" />
          <meta
            content="width=device-width, initial-scale=1.0"
            name="viewport"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
        <time dateTime="2016-10-25" suppressHydrationWarning={true} />
      </Layout>
    );
  }
}
export default Zenfinity;
