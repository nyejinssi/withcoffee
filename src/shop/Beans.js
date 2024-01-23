import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Beans = () => {

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

  const brands = ['스타벅스', '맥심', '폴바셋', '테라로사', '카누', '일리', '블루보틀', '라바짜'];
  const priceRanges = [
    { value: '0', label: '~1만 원' },
    { value: '1', label: '1만 원 ~ 2만 5천 원' },
    { value: '2', label: '2만 5천 원 ~ 5만 원' },
    { value: '3', label: '5만 원 이상' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsCollection = collection(dbService, 'Beans');
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
        (brandFilter === '' || product.brand=== brandFilter ) &&
        (caffeineFilter === '' || product.caffeine === parseInt(caffeineFilter)) &&
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
          sortedProducts.sort((a, b) => b.purchaseCnt - a.purchaseCnt);
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
          sortedProducts.sort((a, b) => b.purchaseCnt - a.purchaseCnt);
          break;
      }

      // 브랜드 필터
  const handleBrandFilter = (value) => {
    // 이미 선택된 브랜드라면 해제, 아니면 추가
    setBrandFilter(prevFilter => prevFilter === value ? '' : value);
  };

  // 가격대 필터
  const handlePriceFilter = (value) => {
    // 이미 선택된 가격대라면 해제, 아니면 추가
    setPriceFilter(prevFilter => prevFilter === value ? '' : value);
  };


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

// 카페인 유무 출력
const getCaffeineInfo = (caffeineValue) => {
  return caffeineValue === 1 ? '카페인' : '디카페인';
};


// 카페인 필터
const handleCaffeineFilter = (value) => {
  setCaffeineFilter((prevFilter) => (prevFilter === value ? '' : value));
};


// 브랜드 필터
const handleBrandFilter = (value) => {
  // 이미 선택된 브랜드라면 해제, 아니면 추가
  setBrandFilter(prevFilter => prevFilter === value ? '' : value);
};

// 가격대 필터
const handlePriceFilter = (value) => {
  // 이미 선택된 가격대라면 해제, 아니면 추가
  setPriceFilter(prevFilter => prevFilter === value ? '' : value);
};

// 단일 선택으로 수정하고, 모든 필터가 checked된 상태에서 다시 클릭하면 해제
const handleTypeFilter = (value) => {
  setTypeFilter((prevFilter) => (prevFilter === value ? '' : value));
};

const handleRateFilter = (value) => {
  setRateFilter((prevFilter) => (prevFilter === value ? '' : value));
};

const handleSortOrder = (value) => {
  setSortOrder((prevFilter) => (prevFilter === value ? '' : value));
};


  return (
    <div className="Beans">
      <button disabled>
        원두
      </button>
      <button>
      <Link to="/shop/Tools">
        <button>도구</button>
      </Link>
      </button>
    {/* 페이지당 아이템 수 선택 UI */}
      <label>
        페이지당 아이템 수:
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </label>

        <div>
        <label>카테고리</label>
        <label>
          <input
            type="checkbox"
            value="0"
            checked={typeFilter === '0'}
            onChange={() =>  handleTypeFilter('0')}
          />
          로스팅 홀빈
        </label>
        <label>
          <input
            type="checkbox"
            value="1"
            checked={typeFilter === '1'}
            onChange={() => handleTypeFilter('1')}
          />
          분쇄
        </label>
        <label>
          <input
            type="checkbox"
            value="2"
            checked={typeFilter === '2'}
            onChange={() => handleTypeFilter('2')}
          />
          생두
        </label>
      </div>

      <div>
        <label>브랜드</label>
        {brands.map(brand => (
          <label key={brand}>
            <input
              type="checkbox"
              value={brand}
              checked={brandFilter.includes(brand)}
              onChange={() => handleBrandFilter(brand)}
            />
            {brand}
          </label>
        ))}
      </div>

      {/* 카페인 필터 */}
      <div>
        <label>카페인 유무</label>
        <label>
          <input
            type="checkbox"
            value="1"
            checked={caffeineFilter === '1'}
            onChange={() => handleCaffeineFilter('1')}
          />
          카페인
        </label>
        <label>
          <input
            type="checkbox"
            value="0"
            checked={caffeineFilter === '0'}
            onChange={() => handleCaffeineFilter('0')}
          />
          디카페인
        </label>
      </div>

    {/* 가격대 필터 */}
    <div>
      <label>가격대</label>
      {priceRanges.map((range, index) => (
        <label key={index}>
          <input
            type="checkbox"
            value={index}
            checked={priceFilter.includes(index.toString())}
            onChange={() => handlePriceFilter(index.toString())}
          />
          {range.label}
        </label>
      ))}
    </div>

      {/* 별점 필터 */}
      <div>
        <label>별점</label>
        <label>
          <input
            type="checkbox"
            value="1"
            checked={rateFilter === '1'}
            onChange={() => handleRateFilter('1')}
          />
          1점 이상
        </label>
        <label>
          <input
            type="checkbox"
            value="2"
            checked={rateFilter === '2'}
            onChange={() => handleRateFilter('2')}
          />
          2점 이상
        </label>
        <label>
          <input
            type="checkbox"
            value="3"
            checked={rateFilter === '3'}
            onChange={() => handleRateFilter('3')}
          />
          3점 이상
        </label>
        <label>
          <input
            type="checkbox"
            value="4"
            checked={rateFilter === '4'}
            onChange={() => handleRateFilter('4')}
          />
          4점 이상
        </label>
      </div>

          {/* 정렬 기준 필터 */}
    <div>
      <label>정렬 기준</label>
      <label>
        <input
          type="checkbox"
          value="popularity"
          checked={sortOrder === 'popularity'}
          onChange={() => handleSortOrder('popularity')}
        />
        인기순
      </label>
      <label>
        <input
          type="checkbox"
          value="priceHigh"
          checked={sortOrder === 'priceHigh'}
          onChange={() => handleSortOrder('priceHigh')}
        />
        가격 높은 순
      </label>
      <label>
        <input
          type="checkbox"
          value="priceLow"
          checked={sortOrder === 'priceLow'}
          onChange={() => handleSortOrder('priceLow')}
        />
        가격 낮은 순
      </label>
      <label>
        <input
          type="checkbox"
          value="ratingHigh"
          checked={sortOrder === 'ratingHigh'}
          onChange={() => handleSortOrder('ratingHigh')}
        />
        인터넷 별점 높은 순
      </label>
    </div>

       {/* 상품 목록 렌더링 */}
      <ul>
        {getCurrentProducts().map(product => (
          <li key={product.id}>
            <p>카테고리: {getTypeString(product.type)}</p>
            <p>브랜드: {product.brand}</p>
            <p>제품명: 
            <Link to={`/shop/Detail/${product.id}`}>
              {product.name}
            </Link>
            </p>
            <p>카페인 여부: {getCaffeineInfo(product.caffeine)}</p>
            <p>가격: {formatPrice(product.price)}</p>
            <p>인터넷 별점: {product.rate}</p>
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

export default Beans;