import React from 'react'
import { Link } from 'react-router-dom'

export default function Apperrorpage() {
    return (
        <>
        <div className='container me-5'>
        <section className="page_404" style={{ padding: '40px 0', background: '#fff', fontFamily: "'Arvo', serif"}}
        >
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div
                            className="col-sm-10 col-sm-offset-1 text-center"
                        >
                            <div
                                className="four_zero_four_bg"
                                style={{
                                    backgroundImage:
                                        'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                                    height: '400px',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <h1
                                    className="text-center"
                                    style={{ fontSize: '80px' }}
                                >
                                    404
                                </h1>
                            </div>

                            <div
                                className="contant_box_404"
                                style={{ marginTop: '-50px' }}
                            >
                                <h3 className="h2">Look like you're lost</h3>
                                <p>The page you are looking for is not available!</p>
                                <a
                                    href="/"
                                    className="link_404"
                                    style={{
                                        color: '#fff',
                                        padding: '10px 20px',
                                        background: '#39ac31',
                                        margin: '20px 0',
                                        display: 'inline-block',
                                        textDecoration: 'none',
                                        borderRadius:'10px'
                                        
                                    }}
                                >
                                    Go to Home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
</>
    )
}
