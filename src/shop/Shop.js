import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Shop = () => {
  const [products, setProducts] = useState([]); // 전체 상품 리스트
  const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 리스트
  const [brandFilter, setBrandFilter] = useState(''); // 브랜드 필터
  const [caffeineFilter, setCaffeineFilter] = useState(''); // 카페인 필터
  const [typeFilter, setTypeFilter] = useState(''); // 타입 필터
  const [priceFilter, setPriceFilter] = useState(''); // 가격대 필터
  const [rateFilter, setRateFilter] = useState(''); // 별점 필터
  const [sortOrder, setSortOrder] = useState(''); // 정렬 필터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(20); //페이지당 상품 갯수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsCollection = collection(dbService, 'Products', 'Beans', 'Amazon');
        const querySnapshot = await getDocs(productsCollection);

        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      return (
        (brandFilter === '' || product.brand.toLowerCase() === brandFilter.toLowerCase()) &&
        (caffeineFilter === '' || product.caffeine === (caffeineFilter === 'true')) &&
        (typeFilter === '' || product.type === parseInt(typeFilter)) &&
        (priceFilter === '' || checkPriceRange(product.price, priceFilter)) &&
        (rateFilter === '' || checkRating(product.rate, rateFilter))
      );
    });

    setFilteredProducts(filtered);
  }, [brandFilter, caffeineFilter, typeFilter, priceFilter, rateFilter, products]);
  
  const sortFilteredProducts = () => {
    setFilteredProducts(prevFilteredProducts => {
      let sortedProducts = [...prevFilteredProducts];

      // 선택된 정렬 기준에 따라 정렬
      switch (sortOrder) {
        case 'popularity':
          // 여기에 인기순 정렬 로직 추가
          break;
        case 'priceHigh':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'priceLow':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'ratingHigh':
          sortedProducts.sort((a, b) => b.rate - a.rate);
          break;
        default:
          // 기본은 인기순 정렬
          // 여기에 인기순 정렬 로직 추가
          break;
      }

      return sortedProducts;
    });
  };

  useEffect(() => {
    sortFilteredProducts();
  }, [sortOrder, currentPage, itemsPerPage]);

  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const checkPriceRange = (price, range) => {
    switch (range) {
      case '0':
        return price < 10000;
      case '1':
        return price >= 10000 && price < 25000;
      case '2':
        return price >= 25000 && price < 50000;
      case '3':
        return price >= 50000;
      default:
        return false;
    }
  };

  const checkRating = (rate, minRating) => { //별점 *점 이상을 구분하기 위한 함수
    return rate >= minRating;
  };

  const formatPrice = (price) => { //가격 형식
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const getTypeString = (type) => { //타입
    switch (type) {
      case 0:
        return '로스팅 홀빈';
      case 1:
        return '분쇄';
      case 2:
        return '생두';
      default:
        return '';
    }
  };

  const paginate = (array, currentPage, itemsPerPage) => { //페이지를 만드는 함수
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  };

  const changePage = (pageNumber) => { //페이지 변경을 처리
    setCurrentPage(pageNumber);
  };

  


  return (
    <div className="Shop">
    {/* 페이지당 아이템 수 선택 UI */}
      <label>
        페이지당 아이템 수:
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </label>
      {/* 브랜드 필터 */}
      <div>
        <label>브랜드</label>
        <label>
          <input
            type="radio"
            value="Starbucks"
            checked={brandFilter.toLowerCase() === 'starbucks'}
            onChange={() => setBrandFilter('Starbucks')}
          />
          스타벅스(Starbucks)
        </label>
        <label>
          <input
            type="radio"
            value="Maxim"
            checked={brandFilter.toLowerCase() === 'maxim'}
            onChange={() => setBrandFilter('Maxim')}
          />
          맥심(Maxim)
        </label>
      </div>

      {/* 카페인 필터 */}
      <div>
        <label>카페인 유무</label>
        <label>
          <input
            type="radio"
            value="true"
            checked={caffeineFilter === 'true'}
            onChange={() => setCaffeineFilter('true')}
          />
          카페인
        </label>
        <label>
          <input
            type="radio"
            value="false"
            checked={caffeineFilter === 'false'}
            onChange={() => setCaffeineFilter('false')}
          />
          디카페인
        </label>
      </div>

      {/* 타입 필터 */}
      <div>
        <label>타입</label>
        <label>
          <input
            type="radio"
            value="0"
            checked={typeFilter === '0'}
            onChange={() => setTypeFilter('0')}
          />
          로스팅 홀빈
        </label>
        <label>
          <input
            type="radio"
            value="1"
            checked={typeFilter === '1'}
            onChange={() => setTypeFilter('1')}
          />
          분쇄
        </label>
        <label>
          <input
            type="radio"
            value="2"
            checked={typeFilter === '2'}
            onChange={() => setTypeFilter('2')}
          />
          생두
        </label>
      </div>

      {/* 가격대 필터 */}
      <div>
        <label>가격대</label>
        <label>
          <input
            type="radio"
            value="0"
            checked={priceFilter === '0'}
            onChange={() => setPriceFilter('0')}
          />
          ~1만 원
        </label>
        <label>
          <input
            type="radio"
            value="1"
            checked={priceFilter === '1'}
            onChange={() => setPriceFilter('1')}
          />
          1만 원 ~ 2만 5천 원
        </label>
        <label>
          <input
            type="radio"
            value="2"
            checked={priceFilter === '2'}
            onChange={() => setPriceFilter('2')}
          />
          2만 5천 원 ~ 5만 원
        </label>
        <label>
          <input
            type="radio"
            value="3"
            checked={priceFilter === '3'}
            onChange={() => setPriceFilter('3')}
          />
          5만 원~
        </label>
      </div>

      {/* 별점 필터 */}
      <div>
        <label>별점</label>
        <label>
          <input
            type="radio"
            value="1"
            checked={rateFilter === '1'}
            onChange={() => setRateFilter('1')}
          />
          1점 이상
        </label>
        <label>
          <input
            type="radio"
            value="2"
            checked={rateFilter === '2'}
            onChange={() => setRateFilter('2')}
          />
          2점 이상
        </label>
        <label>
          <input
            type="radio"
            value="3"
            checked={rateFilter === '3'}
            onChange={() => setRateFilter('3')}
          />
          3점 이상
        </label>
        <label>
          <input
            type="radio"
            value="4"
            checked={rateFilter === '4'}
            onChange={() => setRateFilter('4')}
          />
          4점 이상
        </label>
      </div>

          {/* 정렬 기준 필터 */}
    <div>
      <label>정렬 기준</label>
      <label>
        <input
          type="radio"
          value="popularity"
          checked={sortOrder === 'popularity'}
          onChange={() => setSortOrder('popularity')}
        />
        인기순
      </label>
      <label>
        <input
          type="radio"
          value="priceHigh"
          checked={sortOrder === 'priceHigh'}
          onChange={() => setSortOrder('priceHigh')}
        />
        가격 높은 순
      </label>
      <label>
        <input
          type="radio"
          value="priceLow"
          checked={sortOrder === 'priceLow'}
          onChange={() => setSortOrder('priceLow')}
        />
        가격 낮은 순
      </label>
      <label>
        <input
          type="radio"
          value="ratingHigh"
          checked={sortOrder === 'ratingHigh'}
          onChange={() => setSortOrder('ratingHigh')}
        />
        별점 높은 순
      </label>
    </div>

       {/* 상품 목록 렌더링 */}
      <ul>
        {getCurrentProducts().map(product => (
          <li key={product.id}>
            <p>브랜드: {product.brand}</p>
            <p>제품명: {product.name}</p>
            <p>가격: {formatPrice(product.price)}</p>
            <p>타입: {getTypeString(product.type)}</p>
            <p>별점: {product.rate}</p>
            {product.image && <img src={product.image} alt="Product" style={{ width: '100px', height: '100px' }} />}
          </li>
        ))}
      </ul>
            {/* 페이지 넘기기 버튼 */}
      <div>
        {generatePageNumbers().map(pageNumber => (
          <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} disabled={currentPage === pageNumber}>
            {pageNumber}
          </button>
        ))}
      </div>

  </div>
  );
};

export default Shop;