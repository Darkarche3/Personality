import React from 'react';
import { Navbar } from './Navbar';
import { Collapse } from 'antd';
import "./styles/Faq.css";

const { Panel } = Collapse;

export const Faq = () => {
    return (
        <div>
            <Navbar/>
            <div className='container'>
                <h2>FAQ</h2>
                <Collapse accordion defaultActiveKey={['1']}>
                    <Panel header="Delivery and collection information" key="1">
                        <p>The template is downloadable on the platform that you found it on.</p>
                    </Panel>
                    <Panel header="What do I need to know about ordering online?" key="2">
                        <p>It is not avaliable right now.</p>
                    </Panel>
                    <Panel header="Returns and refunds" key="3">
                        <p>Non-refundable.</p>
                    </Panel>
                    <Panel header="Managing my account" key="4">
                        <p>Use the contact form provided.</p>
                    </Panel>
                    <Panel header="Technical issues" key="5">
                        <p>Use the contact form provided.</p>
                    </Panel>
                    <Panel header="Are you a resume template platform?" key="6">
                        <p>No we are not. We are simply a platform that provides links to access the templates your desire.</p>
                    </Panel>
                    <Panel header="Ratings and reviews" key="7">
                        <p>We are a 5 star rated company.</p>
                    </Panel>
                </Collapse>
            </div>
        </div>
    );
};