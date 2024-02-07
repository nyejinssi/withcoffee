import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import { Link, useLocation } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { query, collection, getDocs } from 'firebase/firestore';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import shop from './shop.css';

const Search = () => {
  const location = useLocation();
  const searchQuery = decodeURIComponent(location.pathname.split('/').pop());

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // 추가: 로딩 상태

  const db = getDatabase();
  const BeansRef = ref(db, 'Beans');
  const ToolsRef = ref(db, 'Tools');

  const fetchData = async () => {
    try {
      setLoading(true); 
      const beansSnapshot = await get(BeansRef);
      const toolsSnapshot = await get(ToolsRef);

      if (beansSnapshot.exists() && toolsSnapshot.exists()) {
        const beansData = beansSnapshot.val();
        const toolsData = toolsSnapshot.val();
        const combinedResults = [...Object.values(beansData), ...Object.values(toolsData)];

        const filteredResults = combinedResults.filter(result => {
          const nameTokens = result.name.split(' ');
          return nameTokens.some(token => token.includes(searchQuery));
        });

        const totalItems = filteredResults.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(totalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        

        setSearchResults(filteredResults.slice(startIndex, endIndex));
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const getTypeString = (type) => {
    switch (type) {
      case 0:
        return '로스팅 홀빈';
      case 1:
        return '분쇄';
      case 2:
        return '생두';
      default:
        return type;
    }
  };

  return (
    <div className="shop-container">
      {loading ? ( // 로딩 중일 때 "검색 중입니다"를 출력
      <p>검색 중입니다...</p>
       ) : (
         <>
      {searchResults.length > 0 ? (
        <>
        <h3>{searchQuery}에 대한 검색 결과</h3>
          <ul className="products-list">
          {searchResults.map((result) => (
        <li className="products-list-item" key={result.id}>
          <Link to={`/shop/Detail/${result.id}`}>
            {result.image && (
              <LazyLoadImage
                src={result.image}
                alt="Product"
                effect="blur"
                style={{ width: '100px', height: '100px' }}
              />
            )}
          </Link>
          <div className="product-details">
            <h3><Link to={`/shop/Detail/${result.id}`}>{result.name}</Link></h3>
            <p className="products-metadata">
              카테고리: {getTypeString(result.type)} | 브랜드: {result.brand} | 
              가격: {formatPrice(result.price)} | 인터넷 별점: {result.rate}
            </p>
          </div>
        </li>
      ))}
    </ul>
    
    <div className="pagination-button">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? 'active product-list-next-button' : 'product-list-next-button'}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </button>
      ))}
    </div>
        </>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
      </>
       )}
    </div>
  );
};

export default Search;
