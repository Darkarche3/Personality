import React, { useState } from "react";
import Navbar from "./Navbar";


const ForumPage = () => {
    const [thread, setThread] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ thread });
        setThread("");
    };

    const [reply, setReply] = useState("");

    const handleSubmitReply = (e) => {
        e.preventDefault();
        console.log({ reply });
        setReply("");
    };
    return (
        <>
            <Navbar />
            <main className='home'>
                <h2 className='homeTitle'>Create a Thread</h2>
                <form className='homeForm' onSubmit={handleSubmit}>
                    <div className='home__container'>
                        <label htmlFor='thread'>Title / Description</label>
                        <input
                            type='text'
                            name='thread'
                            required
                            value={thread}
                            onChange={(e) => setThread(e.target.value)}
                        />
                    </div>
                    <button className='homeBtn'>CREATE THREAD</button>
                </form>
            </main>
            <main className='replies'>
                <form className='modal__content' onSubmit={handleSubmitReply}>
                    <label htmlFor='reply'>Reply to the thread</label>
                    <textarea
                        rows={5}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        type='text'
                        name='reply'
                        className='modalInput'
                    />

                    <button className='modalBtn'>SEND</button>
                </form>
            </main>
        </>

    );
}

export default ForumPage