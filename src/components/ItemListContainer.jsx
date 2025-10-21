
import './ItemListContainer.css';

const ItemListContainer = ({ welcome }) => {
    return (
        <main className="item-list-container">
            <div className="greeting-card">
                <h1 className="greeting-text">{welcome}</h1>
            </div>
        </main>
    );
};

export default ItemListContainer;