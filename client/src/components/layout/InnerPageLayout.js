import Header from '../header/Header';

const InnerPageLayout = (props) => {
    return (
        <>
            <Header />
            <div className="main__body">
                <div className="sidebar"></div>
                {props.children}
                <div style={{ flex: '0.33' }} className="widgets"></div>
            </div>
        </>
    )
};

export default InnerPageLayout;
