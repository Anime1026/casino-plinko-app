import React from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

import { DefaultLayout } from '../layouts/DefaultLayout';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;