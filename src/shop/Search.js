import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import { Link, useLocation } from 'react-router-dom';
import { query, collection, getDocs } from 'firebase/firestore';
import shop from './shop.css';

const Search = () => {
  const location = useLocation();
  const searchQuery = decodeURIComponent(location.pathname.split('/').pop());

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Beans 컬렉션에서 검색
        const beansQuerySnapshot = await getDocs(
          query(
            collection(dbService, 'Beans'),
            // 수정된 where 조건: 부분 일치 검색
          )
        );

        const beansResults = beansQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Tools 컬렉션에서 검색
        const toolsQuerySnapshot = await getDocs(
          query(
            collection(dbService, 'Tools'),
            // 수정된 where 조건: 부분 일치 검색
          )
        );

        const toolsResults = toolsQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const combinedResults = [...beansResults, ...toolsResults];
        const totalItems = combinedResults.length;

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(totalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // 수정된 코드: 토큰화 및 부분 일치 검색
        const filteredResults = combinedResults.filter((result) => {
          const nameTokens = result.name.split(' ');
          return nameTokens.some((token) => token.includes(searchQuery));
        });

        setSearchResults(filteredResults.slice(startIndex, endIndex));
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

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
      {searchResults.length > 0 ? (
        <>
          <ul className="products-list">
            {searchResults.map((result) => (
              <li className="products-list-item" key={result.id}>
                <h3>
                  <Link to={`/shop/Detail/${result.id}`}>{result.name}</Link>
                </h3>
                <p className="products-metadata">
                  카테고리: {getTypeString(result.type)} | 브랜드: {result.brand} | 가격: {formatPrice(result.price)} | 인터넷
                  별점: {result.rate}
                </p>
                <Link to={`/shop/Detail/${result.id}`}>
                  {result.image && <img src={result.image} alt="Product" style={{ width: '100px', height: '100px' }} />}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active product-list-next-button' : 'product-list-next-button'}
              >
                {index + 1}
              </button>
            ))}
          </div>

        </>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default Search;
