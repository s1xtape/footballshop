import '../styles/globals.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-phone-number-input/style.css'
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import {persistor,store} from '../redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import {Provider} from 'react-redux'
import {SessionProvider, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import React from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
      <SessionProvider session={session}>
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                  {Component.auth ? (
                      <Auth adminOnly={Component.auth.adminOnly}>
                          <Component {...pageProps} />
                      </Auth>
                  ) : (
                      <Component {...pageProps} />
                  )}
              </PersistGate>
          </Provider>
      </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
    const router = useRouter();
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/unauthorized?message=login required');
        },
    });
    if (status === 'loading') {
        return <div>Loading...</div>;
    }
    if (adminOnly && !session.user.isAdmin) {
        router.push('/unauthorized?message=admin login required');
    }

    return children;
}
export default MyApp;
