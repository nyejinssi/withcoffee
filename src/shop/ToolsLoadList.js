import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';

const formatPrice = (price) => { //가격 형식
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
};

const BeansLoadList = ({ products, scrollPosition }) => {
    return (
      <ul className="products-list">
      {products.map(product => (
        <li className="products-list-item" key={product.id}>
          <Link to={`/shop/Detail/${product.id}`}>
            {product.image && (
              <LazyLoadImage
                src={product.image}
                alt="Product"
                effect="blur"
                style={{ width: '100px', height: '100px' }}
                scrollPosition={scrollPosition} // Pass down the scroll position
              />
            )}
          </Link>
          <div className="product-details">
            <h3><Link to={`/shop/Detail/${product.id}`}>{product.name}</Link></h3>
            <p className="products-metadata">
              카테고리: {product.type} | 브랜드: {product.brand} |  
              가격: {formatPrice(product.price)} | 인터넷 별점: {product.rate}
            </p>
          </div>
        </li>
      ))}
    </ul>
    );
  };
  
  // Wrap LoadList with trackWindowScroll HOC
  export default trackWindowScroll(BeansLoadList);
  