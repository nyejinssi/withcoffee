import { getFirestore, addDoc, doc, updateDoc, deleteDoc, getDocs, collection, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { dbService, authService, storageService } from "../../fbase";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import { deleteObject, ref, uploadString, getDownloadURL } from "firebase/storage";
import Home from "./CHome";
import './Cart.css';
import profile from '../../profile.png'
import { v4 as uuidv4 } from 'uuid';

const CList = ({cart}) => {
    const user = authService.currentUser;
    const [Count, setCount] = useState(cart.countNumber);

    const onDeleteClick = async () => {
            await deleteDoc(doc(dbService, `Cart/${cart.id}`));
            if(cart.ProductImg !== "") {
                await deleteDoc(doc(dbService, cart.ProductImg));
            }
    };

    const onChange = (event) => { 
        const { target: {name, value} } = event; 
        if(name === "Count") {
            setCount(value);
        }
    };

    const NumberChange  = (event) => {
        const newNumber ={ countNumber: Count }
        updateDoc(doc(dbService, `Cart/${cart.id}`), newNumber);
    };

    const onSubmit = async (event) => { event.preventDefault(); };

    return(
        <>
         <ul className="cartList" id="#">
          <li style={{ margin: 0, paddingLeft: 0 }}>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="#"
                defaultValue="option1"
              />
              <img className="imgConts" src={cart.ProductImg}/>
            </div>
          </li>
          <li>
            

            <p id="idConts">
                상품이름 : {cart.ProductName}<br/>
            </p>
          </li>
          <li>
            <span>
                {cart.countNumber}<br/> {/*상품 갯수 */}
              <input
                type="button"
                className="editConts"
                id="goods1Edit"
                defaultValue="변경"
              />
            </span>
          </li>
          <li p="" className="amountConts">
                {cart.ProductPrice}<br/> {/*상품 가격 */}
          </li>
          <li>
          <Link to="/Payment/*">
            <input
              type="button"
              className="orderConts"
              id="goods1Order"
              defaultValue="주문하기"
            />
            </Link>
          </li>
        </ul>
        </>
        
    );
};

export default CList;