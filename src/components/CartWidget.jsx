
const CartWidget = () => {
    const itemCount = 12;
    return (
        <button className="btn btn-outline-success" type="button">
            <i className={`bi ${itemCount > 0 ? 'bi-cart-fill' : 'bi-cart'}`}> </i>
            <span className="badge rounded-pill bg-danger">{itemCount}</span>
        </button>
    );
};

export default CartWidget;