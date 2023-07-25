import React from 'react';
import { Navbar } from "../components/Navbar";
import { Collapse } from 'antd';
import "../styles/Faq.css";

const { Panel } = Collapse;

export const Faq = () => {
    return (
        <div>
            <Navbar/>
            <div className='container'>
                <h2>FAQ</h2>
                <Collapse accordion defaultActiveKey={['1']}>
                    <Panel header="Why are the resumes not availiable on the website?" key="1">
                        <p>Due to copyright laws and some creators may demand payment for their resumes, we did not see it as possible to put it on our platform. However, we might do so in the future if there is a valid reason.</p>
                    </Panel>
                    <Panel header="What do I need to know about ordering online?" key="2">
                        <p>Go to the website directly and download or buy it there. In the future, we may partner with creators and also have a payment system integrated inside our website to make the process smoother.</p>
                    </Panel>
                    <Panel header="Returns and refunds" key="3">
                        <p>As of now no such system exists. Any refund must be made with the creators themselves.</p>
                    </Panel>
                    <Panel header="Technical issues" key="5">
                        <p>Use our contact form.</p>
                    </Panel>
                    <Panel header="Terms and conditions" key="6">
                        <p>We will have one set up in the future.</p>
                    </Panel>
                    <Panel header="Ratings and reviews" key="7">
                        <p>We plan to include them in the future to allow users to know which resumes are good for use.</p>
                    </Panel>
                </Collapse>
            </div>
        </div>
    );
};