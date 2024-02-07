import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc } from 'firebase/firestore';
import BeansLoadList from './BeansLoadList';
import { getDatabase, ref, get, limitToFirst, onValue, orderByKey } from "firebase/database";
import shop from './shop.css';

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

  // const brands = ['스타벅스', '맥심', '폴바셋', '테라로사', '카누', '일리', '블루보틀', '라바짜'];
  const brands=['스타벅스', '맥심', '카누', '폴바셋']
  const priceRanges = [
    { value: '0', label: '~1만 원' },
    { value: '1', label: '1만 원 ~ 2만 5천 원' },
    { value: '2', label: '2만 5천 원 ~ 5만 원' },
    { value: '3', label: '5만 원 이상' },
  ];

  const db = getDatabase();
  const BeansRef = ref(db, 'Beans');
 
  get(BeansRef).then((snapshot) => {
    if (snapshot.exists()) {
      const products = [];
      snapshot.forEach((childSnapshot) => {
        const productId = childSnapshot.key;
        const productData = childSnapshot.val();
        products.push({
          id: productId,
          ...productData,
        });
      });
      setProducts(products);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });

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

  const generatePageNumbers = () => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pageNumbers = [];
  
    let startPage = Math.max(currentPage - 4, 1);
    let endPage = Math.min(currentPage + 5, totalPages);
  
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 5) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      }
    }
  
    for (let i = startPage; i <= endPage; i++) {
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
    <div className="shop-container">
      <nav className="shop-nav">
        <li><Link to="/shop/Beans">원두</Link></li>
        <li><Link to="/shop/Tools">도구</Link></li>
      </nav>

      <div className="filter-container">
      <table className="filter-table">
        <tbody>
          <tr>
          <th>타입</th>
          <td>
          <label for="wholeBean">
            <input
              type="checkbox" 
              id="wholeBean"
              value="0"
              checked={typeFilter === '0'}
              onChange={() => handleTypeFilter('0')}
            />
            로스팅 홀빈</label>
             </td>

          <td>
          <label for="grindedBean">
          <input
            type="checkbox" 
            id="grindedBean"
            value="1"
            checked={typeFilter === '1'}
            onChange={() => handleTypeFilter('1')}
          />
          분쇄</label>
          </td>

          <td>
          <label for="rawBean">
          <input
            type="checkbox" 
            id="rawBean"
            value="2"
            checked={typeFilter === '2'}
            onChange={() => handleTypeFilter('2')}
          />
          
          생두
          </label>
          </td>
        </tr>

          <tr>
          <th>카페인 유무</th>
            <td>
            <label>
          <input
            type="checkbox" 
            value="1"
            id="caffeine"
            checked={caffeineFilter === '1'}
            onChange={() => handleCaffeineFilter('1')}
          />
          카페인
        </label>
        </td>

        <td>
        <label>
          <input
            type="checkbox" 
            value="0"
            checked={caffeineFilter === '0'}
            onChange={() => handleCaffeineFilter('0')}
          />
          디카페인
        </label>
        </td>
      </tr>

      <tr>
      <th>브랜드</th>
      {brands.map((brand, index) => (
        <td key={index}>
          <label>
            <input
              type="checkbox" 
              value={brand}
              checked={brandFilter.includes(brand)}
              onChange={() => handleBrandFilter(brand)}
            />
            {brand}
          </label>
        </td>
      ))}
    </tr>

      <tr>
            <th>별점</th>
            <td>
              <label>
          <input
            type="checkbox" 
            value="1"
            checked={rateFilter === '1'}
            onChange={() => handleRateFilter('1')}
          />
          1점 이상
        </label>
        </td>
        <td>
        <label>
          <input
            type="checkbox" 
            value="2"
            checked={rateFilter === '2'}
            onChange={() => handleRateFilter('2')}
          />
          2점 이상
        </label>
        </td>

        <td>
        <label>
          <input
            type="checkbox" 
            value="3"
            checked={rateFilter === '3'}
            onChange={() => handleRateFilter('3')}
          />
          3점 이상
        </label>
        </td>

        <td>          
        <label>
          <input
            type="checkbox" 
            value="4"
            checked={rateFilter === '4'}
            onChange={() => handleRateFilter('4')}
          />
          4점 이상
        </label>
            </td>
        </tr>

            <tr>
            <th>가격대</th>
              {priceRanges.map((range, index) => (
                <td>
                <label key={index}>
                  <input
                    type="checkbox" 
                    value={index}
                    checked={priceFilter.includes(index.toString())}
                    onChange={() => handlePriceFilter(index.toString())}
                  />
                  {range.label}
                </label>
                </td>
                ))}
          </tr>
        </tbody>
      </table>
      </div>

      <div className="sort-group">
  <table className='sort-table'>
    <tr>
      <td style={{ backgroundColor: sortOrder === 'popularity' || sortOrder === '' ? 'black' : 'white' }}>
        <label style={{ color: sortOrder === 'popularity' || sortOrder === '' ? 'white' : 'black' }}>
          <input
            type="checkbox"
            value="popularity"
            checked={sortOrder === 'popularity' || sortOrder === ''}
            onChange={() => handleSortOrder(sortOrder === 'popularity' ? '' : 'popularity')}
          />
          인기순
        </label>
      </td>

      <td style={{ backgroundColor: sortOrder === 'priceHigh' ? 'black' : 'white' }}>
        <label style={{ color: sortOrder === 'priceHigh' ? 'white' : 'black' }}>
          <input
            type="checkbox"
            value="priceHigh"
            checked={sortOrder === 'priceHigh'}
            onChange={() => handleSortOrder(sortOrder === 'priceHigh' ? '' : 'priceHigh')}
          />
          가격 높은 순
        </label>
      </td>

      <td style={{ backgroundColor: sortOrder === 'priceLow' ? 'black' : 'white' }}>
        <label style={{ color: sortOrder === 'priceLow' ? 'white' : 'black' }}>
          <input
            type="checkbox"
            value="priceLow"
            checked={sortOrder === 'priceLow'}
            onChange={() => handleSortOrder(sortOrder === 'priceLow' ? '' : 'priceLow')}
          />
          가격 낮은 순
        </label>
      </td>

      <td style={{ backgroundColor: sortOrder === 'ratingHigh' ? 'black' : 'white' }}>
        <label style={{ color: sortOrder === 'ratingHigh' ? 'white' : 'black' }}>
          <input
            type="checkbox"
            value="ratingHigh"
            checked={sortOrder === 'ratingHigh'}
            onChange={() => handleSortOrder(sortOrder === 'ratingHigh' ? '' : 'ratingHigh')}
          />
          인터넷 별점 높은 순
        </label>
      </td>
    </tr>
  </table>
</div>



       {/* 상품 목록 렌더링 */}
       <BeansLoadList products={getCurrentProducts()}/>
       
       <div className='pagination-button'>
        {generatePageNumbers().map(pageNumber => (
          <button className='product-list-next-button' key={pageNumber} onClick={() => setCurrentPage(pageNumber)} disabled={currentPage === pageNumber}>
            {pageNumber}
          </button>
        ))}
      </div>
      </div>

  );
};

export default Beans;