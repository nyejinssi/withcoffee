import React, { useState, useEffect } from "react";
import { dbService, storageService } from "../fbase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, setDoc } from 'firebase/firestore';

const MbtibeansInput = () => {
  useEffect(() => {
    const mbtiBeansData = [
        {"id":1,"body":1,"acidity":1,"sweet":1,"cove":1,"flavor":1,"name":"코스타리카 볼칸 아술 오바타","dec":"은은한 산딸기향과 함께, 모스카토 와인을 연상시키는 우아한 향미와 높은 당도를 가진 커피","url":"https:\/\/smartstore.naver.com\/ggbarista2\/products\/7446437236?NaPm=ct%3Dlrxfvxl4%7Cci%3D18aa94a312776f1ba13bcd41190782fa904457c0%7Ctr%3Dslsl%7Csn%3D489700%7Chk%3Dc97e400e4d64b841431fef8df9bed044b455b5a9"},
        {"id":2,"body":1,"acidity":1,"sweet":1,"cove":1,"flavor":0,"name":"파나마 에스메랄라 게이샤","dec":"첫 모금에 복숭아와 제스민 향의 상큼함이 입 안 가득 느껴지면서 올라오는 단맛이 밸런스를 맞춰주며 향과 맛의 조화를 이루며 긴 여운을 남겨주는 커피","url":"https:\/\/smartstore.naver.com\/ggbarista2\/products\/7446437236?NaPm=ct%3Dlrxfvxl4%7Cci%3D18aa94a312776f1ba13bcd41190782fa904457c0%7Ctr%3Dslsl%7Csn%3D489700%7Chk%3Dc97e400e4d64b841431fef8df9bed044b455b5a9"},
        {"id":3,"body":1,"acidity":1,"sweet":1,"cove":0,"flavor":1,"name":"예멘 모카 마타리 ","dec":"묵직한 마디감, 새콤한 맛과 쓴맛의 환상적인 조화, 진한 다크 초콜릿 향이 매력적인 커피","url":"https:\/\/smartstore.naver.com\/coboccoffee\/products\/7849825501?NaPm=ct%3Dlrxfz0p4%7Cci%3D92f4cfffdf00b6ebacb7877944817ed3955f50f9%7Ctr%3Dslsl%7Csn%3D461414%7Chk%3Dc251276b9893d72ccc910dea2facf7ad70cc2121"},
        {"id":4,"body":1,"acidity":1,"sweet":0,"cove":0,"flavor":0,"name":"에티오피아 카라모","dec":"높은 곳에 위치한 지리적 특성으로 커피의 맛과 향미가 더욱 좋은 2020 Cup Of Excellent 우승작 커피","url":"https:\/\/smartstore.naver.com\/unroasters\/products\/8216407898?NaPm=ct%3Dlrxg1mu0%7Cci%3D00e3855ff78029b0b04834e857ca542b51e26300%7Ctr%3Dslsl%7Csn%3D3903138%7Chk%3De414ad9a125f2bc7969564c3a8fc5d2398c0b8be"},
        {"id":5,"body":1,"acidity":1,"sweet":0,"cove":1,"flavor":1,"name":" 탄자니아 킬리만자로","dec":"영국 황실에서 즐겨 마시는 커피로 내추럴 방식으로 건조를 거쳐 풍미가 뛰어난 커피","url":"https:\/\/www.coffeeday.co.kr\/goods\/goods_view.php?goodsNo=157&inflow=naver&NaPm=ct%3Dlrxg3o4w%7Cci%3D7ab45f29d2f4b07eb27ab6f265c8e325ca92ad6e%7Ctr%3Dslsl%7Csn%3D292635%7Chk%3D6885f970238520bd5ef77c80f64fb242e637c7c8"},
        {"id":6,"body":1,"acidity":1,"sweet":0,"cove":1,"flavor":0,"name":"에티오피아 예가체프","dec":"부드러운 신 맛, 과하지 않은 단맛과 깔끔한 맛, 과실의 향이 피어나는 커피  ","url":"https:\/\/smartstore.naver.com\/kongnamoo\/products\/2458239029?NaPm=ct%3Dls2v3k6o%7Cci%3Dc415105878702657569a8b7854bbd12ab337d2e4%7Ctr%3Dslsl%7Csn%3D566993%7Chk%3D4e61b5f667f9ddb83d9ed63f490d6a1daec17fda"},
        {"id":7,"body":1,"acidity":1,"sweet":0,"cove":0,"flavor":1,"name":"과테말라 우에우에테낭고","dec":"습도 비율 60~70%의 고산지역에서 자라는 이 원두는 호두, 시리얼 향이 나며 단맛에 포커스가 맞춰져 있는 커피","url":"https:\/\/smartstore.naver.com\/beanmarket\/products\/5044125297?NaPm=ct%3Dlrxg4c20%7Cci%3D297ac7d1f1fa45e9b1c5111815ed3c812f105717%7Ctr%3Dslsl%7Csn%3D554738%7Chk%3Dd164f2231da292fcda902483aa270b0add4d717b"},
        {"id":8,"body":1,"acidity":1,"sweet":0,"cove":0,"flavor":0,"name":"케냐 피베리","dec":"바디감이 묵직하고 산미가 강하며 초콜릿맛, 감귤맛을 한 번에 느낄 수 있는 커피.","url":"https:\/\/smartstore.naver.com\/coffeeloveshimroasting\/products\/6866377323?NaPm=ct%3Dlrxg5n4g%7Cci%3Dca76bb8e3b7b5ee927112d27490a637be0e6c579%7Ctr%3Dslsl%7Csn%3D6330765%7Chk%3D5ebc24296af0cfcf9ae75b7ee4df503f979b5bab"},
        {"id":9,"body":1,"acidity":0,"sweet":1,"cove":1,"flavor":1,"name":"과테말라 엘 소로코 마라카투라","dec":"많은 매니아들로부터 과테말라 최고의 커피로 인정받는 고급 품종 커피.","url":"https:\/\/micoffee.co.kr\/goods\/goods_view.php?goodsNo=1000002796&inflow=naver&NaPm=ct%3Dlrxgbdww%7Cci%3D50f8666f6cc65ca36cd85ef4ebb8173b627c29f6%7Ctr%3Dslsl%7Csn%3D8537034%7Chk%3De13290b8a0087a417bebb702a587b6f08bacf9af"},
        {"id":10,"body":1,"acidity":0,"sweet":1,"cove":1,"flavor":0,"name":"자메이카 블루마운틴","dec":"세계 3대 커피 중 하나로 와인의 쌉싸래한 맛, 부드러운 쓴 맛, 단맛, 스모크한 맛을 지닌 커피.","url":"https:\/\/micoffee.co.kr\/goods\/goods_view.php?goodsNo=1000002796&inflow=naver&NaPm=ct%3Dlrxgbdww%7Cci%3D50f8666f6cc65ca36cd85ef4ebb8173b627c29f6%7Ctr%3Dslsl%7Csn%3D8537034%7Chk%3De13290b8a0087a417bebb702a587b6f08bacf9af"},
        {"id":11,"body":1,"acidity":0,"sweet":1,"cove":0,"flavor":1,"name":"코스타리카 따라주","dec":"고산지대로 일교차가 커 커피 체리의 수축\/이완작용으로 인해 생두의 조밀도가 강해 훌륭한 바디감을 갖춘 커피.","url":"https:\/\/smartstore.naver.com\/coffeecp\/products\/4637435024?NaPm=ct%3Dlrxgfmow%7Cci%3De47b4a5f32845fdd0282d4a5e9cd37ef0a1476e1%7Ctr%3Dslsl%7Csn%3D222893%7Chk%3D6268f5c18ec99a45db43a88a782f93b91f9cae8a"},
        {"id":12,"body":1,"acidity":0,"sweet":0,"cove":0,"flavor":0,"name":"케냐 키암부","dec":"‘아웃 오브 아프리카’의 배경이 되었던 케냐 키암부에서 난 커피로 은은한 과일 산미와 묵직한 바디감이 어우러지는 커피.","url":"https:\/\/smartstore.naver.com\/coffeecp\/products\/4634853737?NaPm=ct%3Dlrxgdvf4%7Cci%3D069cf7cff1b48d45865b30ad6342f88464b678ea%7Ctr%3Dslsl%7Csn%3D222893%7Chk%3D073bb8ac532389548a920dc0397c70a5b925bcc2"},
        {"id":13,"body":1,"acidity":0,"sweet":0,"cove":1,"flavor":1,"name":"인도네시아 만델링 g1","dec":"특유의 부드럽고 풍부한 바디와 다크초콜렛의 플레이버로 진한 향을 즐길 수 있는 커피.","url":"https:\/\/smartstore.naver.com\/modoocoffee\/products\/2452960322?NaPm=ct%3Dlrxgd7i0%7Cci%3Dbb27553096decd607b4eb81f668415d628f85753%7Ctr%3Dslsl%7Csn%3D593386%7Chk%3Dbeffcae3154c442679d03fe9017c9a56c0ed19ff"},
        {"id":14,"body":1,"acidity":0,"sweet":0,"cove":0,"flavor":0,"name":"에티오피아 하라","dec":"깊고 중후한 향미와 감미로운 와인 향, 오묘한 신맛 같은 단맛, 상큼한 흙냄새 등이 어우러진 커피.","url":"https:\/\/coffeetory.co.kr\/product\/detail.html?product_no=782&cate_no=24&display_group=1&cafe_mkt=naver_ks&mkt_in=Y&ghost_mall_id=naver&ref=naver_open&n_media=11068&n_query=%EC%97%90%ED%8B%B0%EC%98%A4%ED%94%BC%EC%95%84%ED%95%98%EB%9D%BC&n_rank=1&n_ad_group=grp-a001-02-000000011194074&n_ad=nad-a001-02-000000064189710&n_campaign_type=2&n_mall_id=coffeetory&n_mall_pid=782&n_ad_group_type=2&n_match=3&NaPm=ct%3Dlrxghn80%7Cci%3D0zG00022eVnz8RipNfls%7Ctr%3Dpla%7Chk%3D47b4f839a30951cacb3fab04c6191be77c24df06"},
        {"id":15,"body":1,"acidity":0,"sweet":0,"cove":0,"flavor":1,"name":"과테말라 안티구아","dec":"중후한 바디감, 다크초코의 쌉싸르함, 스모키한 여운, 우아하고 뛰어난 감칠맛을 즐길 수 있는 커피.","url":"https:\/\/smartstore.naver.com\/modoocoffee\/products\/2452928495?NaPm=ct%3Dlrxgil68%7Cci%3D925686582354a55420680dd23c612643ed7152c3%7Ctr%3Dslsl%7Csn%3D593386%7Chk%3D08f9cdc35db5a27eb99951b37f4c4fcf7b2be2a7"},
        {"id":16,"body":1,"acidity":0,"sweet":1,"cove":1,"flavor":0,"name":"엘살바도르 파카마라","dec":"살구 주스, 레몬 제스트와 같은 복합적인 상큼함, 약간의 달콤한 맛, 깨끗한 피니시로 나라 전역에서 사랑받는 커피.","url":"https:\/\/smartstore.naver.com\/latebut\/products\/6902192761?NaPm=ct%3Dlrxgkwi8%7Cci%3Dacf70f212b212d08bc0f80355dde90065abcc126%7Ctr%3Dslsl%7Csn%3D3983188%7Chk%3Dc88110e086d29e126a035613aeca1694033d3a12"}
        ,{"id":17,"body":0,"acidity":1,"sweet":1,"cove":1,"flavor":1,"name":"니카라과 핀카 산 라몬","dec":"바닐라, 꿀, 체리&플럼, 파인애플, 아몬드, 카라멜 맛이 나고, 부드러운 고소함과 스윗한 과일향의 기분좋은 산미가 나며 달콤한 긴 여운이 남는 깔끔한 후미를 가진","url":"https:\/\/smartstore.naver.com\/vistoso_paju\/products\/9289752992?NaPm=ct%3Dlrxgmjx4%7Cci%3D602cbeec7d3047f13f70b4ed99a7fa21214e2129%7Ctr%3Dslsl%7Csn%3D7538386%7Chk%3D1c145cc8dd2b5563059e14aa640dbace297415f0"}
        ,{"id":18,"body":0,"acidity":1,"sweet":1,"cove":1,"flavor":0,"name":"콜롬비아 엘 디아만테 버번","dec":"체리, 카라멜, 오렌지, 청사과 향이 나고, 복숭아, 오렌지, 포도, 카라멜 맛을 느낄 수 있는 것이 특징을 가진 커피.","url":"https:\/\/smartstore.naver.com\/whichcoffee\/products\/6996158793?NaPm=ct%3Dlrxgnfk0%7Cci%3Dc25b1e5d0a0bad3182957a711abedaaeae67d17f%7Ctr%3Dslsl%7Csn%3D951677%7Chk%3D9d1f8a6d2a9fc9e9a7172e127c60aaa9225f3625"}
        ,{"id":19,"body":0,"acidity":1,"sweet":1,"cove":0,"flavor":1,"name":"하와이 코나","dec":"해발 4,000m 이상의 높은 화산 산비탈의 비옥한 토양에서 재배되어 세계 3대 커피 중 하나로 부드러우면서도 톡 쏘는 산미를 가졌으며 향기를 즐길 수 있는 커피.","url":"https:\/\/smartstore.naver.com\/funkeyboy\/products\/6469728307?NaPm=ct%3Dlrxgo1xk%7Cci%3Dc3deb928d383eba12b1933c02b95de06c9a45c01%7Ctr%3Dslsl%7Csn%3D167316%7Chk%3D3b5e1e5124d9afbbb741bffa42f856890fabe52e"}
        ,{"id":20,"body":0,"acidity":1,"sweet":1,"cove":0,"flavor":0,"name":"하와이 코나","dec":"해발 4,000m 이상의 높은 화산 산비탈의 비옥한 토양에서 재배되어 세계 3대 커피 중 하나로 부드러우면서도 톡 쏘는 산미를 가졌으며 향기를 즐길 수 있는 커피.","url":"https:\/\/smartstore.naver.com\/funkeyboy\/products\/6469728307?NaPm=ct%3Dlrxgo1xk%7Cci%3Dc3deb928d383eba12b1933c02b95de06c9a45c01%7Ctr%3Dslsl%7Csn%3D167316%7Chk%3D3b5e1e5124d9afbbb741bffa42f856890fabe52e"}
        ,{"id":21,"body":0,"acidity":1,"sweet":0,"cove":1,"flavor":1,"name":"브라질 산타루시아","dec":"고소한 견과류의 맛과 부드러운 바디감, 초콜릿 뉘앙스와 흑설탕의 달콤함이 어우러진 것이 특징인 커피.","url":"https:\/\/smartstore.naver.com\/sosacoffee\/products\/5809620398?NaPm=ct%3Dlrxgpieg%7Cci%3D7ff7cd41f04630bf8cdeca938b99c75020f95040%7Ctr%3Dslsl%7Csn%3D789812%7Chk%3D24d67c41745e66bf5c4486975fdd6b3482412789"},
        ,{"id":22,"body":0,"acidity":1,"sweet":0,"cove":1,"flavor":0,"name":"콜롬비아 엘 디아만테 버번","dec":"체리, 카라멜, 오렌지, 청사과 향이 나고, 복숭아, 오렌지, 포도, 카라멜 맛을 느낄 수 있는 것이 특징을 가진 커피.","url":"https:\/\/smartstore.naver.com\/whichcoffee\/products\/6996158793?NaPm=ct%3Dlrxgnfk0%7Cci%3Dc25b1e5d0a0bad3182957a711abedaaeae67d17f%7Ctr%3Dslsl%7Csn%3D951677%7Chk%3D9d1f8a6d2a9fc9e9a7172e127c60aaa9225f3625"},
        {"id":23,"body":0,"acidity":1,"sweet":0,"cove":0,"flavor":1,"name":"케냐 키아마니아","dec":"비교적 가벼운 바디감을 가지고 있으며 포도, 패션후르츠, 후추, 홍시, 조청, 호박엿, 오렌지, 감귤, 다크초콜릿 등 아주 많은 맛을 느낄 수 있는 커피.","url":"https:\/\/www.kapucziner.hu\/kenya-aa-plus-kiamania-250g"}
        ,{"id":24,"body":0,"acidity":1,"sweet":0,"cove":0,"flavor":0,"name":"케냐 키아마니아","dec":"비교적 가벼운 바디감을 가지고 있으며 포도, 패션후르츠, 후추, 홍시, 조청, 호박엿, 오렌지, 감귤, 다크초콜릿 등 아주 많은 맛을 느낄 수 있는 커피.","url":"https:\/\/www.kapucziner.hu\/kenya-aa-plus-kiamania-250g"}
        ,{"id":25,"body":0,"acidity":0,"sweet":1,"cove":1,"flavor":1,"name":"콜롬비아 수프리모","dec":"부드러운 맛과 향을 자랑하며, 아침에 먹기 좋은 커피의 대명사로 꾸준히 올라오는 단맛, 고소한 견과류 향, 과일의 산미가 밸런스를 이루는 커피.","url":"https:\/\/smartstore.naver.com\/newwestcoffee\/products\/4676400807?NaPm=ct%3Dlrxgthx4%7Cci%3D5a85776cbc4d5c856e5b4d56532db5444b1e9654%7Ctr%3Dslsl%7Csn%3D732552%7Chk%3Db8dc6aad927e661760e0172cd21c2069ca695ecf"}
        ,{"id":26,"body":0,"acidity":0,"sweet":1,"cove":1,"flavor":0,"name":"브라질 옐로우 버번","dec":"균형있는 산미와 고소함이 강점이며 쓴맛과 신맛의 균형감이 뛰어나고 부드러우며 특이하게도 참기름 같은 고소한 향이 일품인 커피.","url":"https:\/\/smartstore.naver.com\/woonjocoffee\/products\/561517136?NaPm=ct%3Dlrxgvnuo%7Cci%3Ddc073e502945d4f83cd82cdb0fe17554de004c89%7Ctr%3Dslsl%7Csn%3D371716%7Chk%3D6cb55cbf19f23de5ebba08c048232949658ff93b"}
        ,{"id":27,"body":0,"acidity":0,"sweet":1,"cove":0,"flavor":1,"name":"브라질 세하도","dec":"구수한 흙내음, 호두향이 나고, 깊은 단맛을 낄 수 있는 한편 산미와 고소함은 적다는 특징을 가진 커피.","url":"https:\/\/smartstore.naver.com\/coffeecp\/products\/4634867495?NaPm=ct%3Dlrxgwb00%7Cci%3D1b6137c95c3cded4fe5d560d3c063a4760863dd1%7Ctr%3Dslsl%7Csn%3D222893%7Chk%3D2eda3ae350dce001df9deb9ea7e90533036e47cd"}
        ,{"id":28,"body":0,"acidity":0,"sweet":1,"cove":0,"flavor":0,"name":"파푸아뉴기니 쿠아 마운틴 ","dec":"세계 3대 커피 중 하나인 자메이카 블루마운틴의 원종을 파푸아뉴기니 쿠아 산맥의 해발고도 1,400m이상에서 재배하여 감귤, 오렌지 같은 산뜻하고 향기로운 향, 깨끗하고 고급스러운 블루마운틴 특유의 질감을 즐길 수 있는 커피. ","url":"https:\/\/shopping.naver.com\/window-products\/emart\/5898856103?NaPm=ct%3Dlrxgxb9k%7Cci%3Dadb52da6c3efe77f552258127d6dc0c7fd527a9f%7Ctr%3Dslsl%7Csn%3D4531621%7Chk%3De460ceda8a9119d1525312501cdf8ea3345a44be"}
        ,{"id":29,"body":0,"acidity":0,"sweet":0,"cove":1,"flavor":1,"name":"브라질 산타이네스","dec":"고소한 견과류의 맛과 부드러운 바디감, 초콜릿 뉘앙스와 흑설탕의 달콤함이 어우러진 것이 특징인 커피.","url":"https:\/\/smartstore.naver.com\/wondupalisonyeo\/products\/2151272147?NaPm=ct%3Dlrxgyg5s%7Cci%3Dd5f6609e8241fd6c773f90451df6e49d1d5f20fd%7Ctr%3Dslsl%7Csn%3D445613%7Chk%3D05a4650f4ea9876431a8fe56a31dfadae861fc2a"}
        ,{"id":30,"body":0,"acidity":0,"sweet":0,"cove":1,"flavor":0,"name":"과테말라 우에우에테낭고","dec":"습도 비율 60~70%의 고산지역에서 자라는 이 원두는 호두, 시리얼 향이 나며 단맛에 포커스가 맞춰져 있는 커피.","url":"https:\/\/smartstore.naver.com\/beanmarket\/products\/5044125297?NaPm=ct%3Dlrxg4c20%7Cci%3D297ac7d1f1fa45e9b1c5111815ed3c812f105717%7Ctr%3Dslsl%7Csn%3D554738%7Chk%3Dd164f2231da292fcda902483aa270b0add4d717b"}
        ,{"id":31,"body":0,"acidity":0,"sweet":0,"cove":0,"flavor":1,"name":"브라질 산타이네스","dec":"주로 1,000m~ 1,300m의 높은 지대에서 재배되고 땅콩, 카라멜, 오렌지, 꿀 같은 단맛이 오묘하게 어우러지는 커피.","url":"https:\/\/smartstore.naver.com\/wondupalisonyeo\/products\/2151272147?NaPm=ct%3Dlrxgyg5s%7Cci%3Dd5f6609e8241fd6c773f90451df6e49d1d5f20fd%7Ctr%3Dslsl%7Csn%3D445613%7Chk%3D05a4650f4ea9876431a8fe56a31dfadae861fc2a"}
        ,{"id":32,"body":0,"acidity":0,"sweet":0,"cove":0,"flavor":0,"name":"케냐 키아구투 ","dec":"블랙체리, 자몽, 블랙커런트, 흑설탕의 향을 느낄 수 있으며, 무게감이 있는 과일톤과 단맛이 인상적인 커피.","url":"https:\/\/biz.koke.kr\/products\/3451"}
        
    ];
    mbtiBeansData.forEach((mbtiBean) => {
        console.log('Current data:', mbtiBean);
        if (typeof mbtiBean === 'object' && mbtiBean !== null) {
          const { id, body, acidity, sweet, cove, flavor, name, dec, url } = mbtiBean;
  
          // 데이터를 객체로 묶어서 전달
          const data = {
            id,
            body,
            acidity,
            sweet,
            cove,
            flavor,
            name,
            dec,
            url,
          };
  
          // addDoc() 함수에 객체로 된 데이터 전달 (ID를 생략하여 Firestore에게 자동 생성하도록 함)
          addDoc(collection(dbService, 'mbti'), data)
            .then((docRef) => {
              console.log(`Document written with ID: ${docRef.id}`);
            })
            .catch((error) => {
              console.error('Error writing document: ', error);
            });
        } else {
          console.error('Invalid data format: ', mbtiBean);
        }
      });
    }, []);
  

  return (
    <div>
      {/* Your component content goes here */}
    </div>
  );
};

export default MbtibeansInput;
