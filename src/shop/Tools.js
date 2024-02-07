import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import { getDatabase, ref, get } from "firebase/database";
import { Link, Route, useLocation } from 'react-router-dom';
import ToolsLoadList from './ToolsLoadList';
import { collection, getDocs, query, where } from 'firebase/firestore';
import shop from './shop.css';

const Tools= () => { 
  const [products, setProducts] = useState([]); // 전체 상품 리스트
  const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 리스트
  const [brandFilter, setBrandFilter] = useState(''); // 브랜드 필터        
  const [typeFilter, setTypeFilter] = useState(''); // 타입 필터
  const [priceFilter, setPriceFilter] = useState(''); // 가격대 필터
  const [rateFilter, setRateFilter] = useState(''); // 별점 필터
  const [sortOrder, setSortOrder] = useState(''); // 정렬 필터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(20); //페이지당 상품 갯수
  
  const brands = ['브레빌', '네스프레소', '돌체구스토', '일리', '드롱기', '밀리타', '하리오'];
  const priceRanges = [
    { value: '0', label: '~5만 원' },
    { value: '1', label: '5만 원 ~ 10만 원' },
    { value: '2', label: '10만 원 ~ 20만 원' },
    { value: '3', label: '20만 원 이상' },
  ];
  const types=['에스프레소머신', '캡슐/POD머신', '업소용에스프레소머신', '커피메이커', '우유거품기', '여과지']
  const [selectedTypes, setSelectedTypes] = useState([]);

 const db = getDatabase();
 const ToolsRef = ref(db, 'Tools');
//  const query = ToolsRef.limitToFirst(20);

 get(ToolsRef).then((snapshot) => {
   if (snapshot.exists()) {
     const products = [];
     snapshot.forEach((childSnapshot) => {
       const productId = childSnapshot.key;
       const productData = childSnapshot.val();
       // productId와 productData를 사용하여 필요한 작업 수행
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const productsCollection = collection(dbService, 'Tools');
  //       const querySnapshot = await getDocs(productsCollection);

  //       const fetchedProducts = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       setProducts(fetchedProducts);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      return (
        (brandFilter === '' || product.brand === brandFilter) &&
        (selectedTypes.length === 0 || selectedTypes.includes(product.type)) &&
        (priceFilter === '' || checkPriceRange(product.price, priceFilter)) &&
        (rateFilter === '' || checkRating(product.rate, rateFilter))
      );
    });
  
    setFilteredProducts(filtered);
  }, [brandFilter, selectedTypes, priceFilter, rateFilter, products]);  
  
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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
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
        return price < 50000;
      case '1':
        return price >= 50000 && price < 100000;
      case '2':
        return price >= 100000 && price < 200000;
      case '3':
        return price >= 200000;
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

  const paginate = (array, currentPage, itemsPerPage) => { //페이지를 만드는 함수
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  };

  const changePage = (pageNumber) => { //페이지 변경을 처리
    setCurrentPage(pageNumber);
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
  setSelectedTypes((prevSelectedTypes) => {
    if (prevSelectedTypes.includes(value)) {
      // If the type is already selected, remove it
      return prevSelectedTypes.filter((type) => type !== value);
    } else {
      // If the type is not selected, add it
      return [...prevSelectedTypes, value];
    }
  });
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
              {types.map((type) => (
                <td>
                <label key={type}>
                  <input
                    type="checkbox" className="custom-checkbox"
                    value={type}
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeFilter(type)}
                  />
                  {type}
                </label>
                </td>
              ))}
          </tr>

      <tr>
        <th>브랜드</th>
          {brands.map((brand) => (
            <td>
            <label key={brand}>
              <input
                type="checkbox" className="custom-checkbox"
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
              type="checkbox" className="custom-checkbox"
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
              type="checkbox" className="custom-checkbox"
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
              type="checkbox" className="custom-checkbox"
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
              type="checkbox" className="custom-checkbox"
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
                type="checkbox" className="custom-checkbox"
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

    <ToolsLoadList products={getCurrentProducts()}/>
            {/* 페이지 넘기기 버튼 */}
    
        
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

export default Tools;