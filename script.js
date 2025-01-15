// 방문자 정보 가져오기
async function visitorsData() {
	const response = await fetch("./선수제공파일/B_Module/visitors.json");
	const data = await response.json();
	return data;
}

// 굿즈 정보 가져오기
async function goodsData() {
	const response = await fetch("./선수제공파일/B_Module/goods.json");
	const data = await response.json();
	return data;
}

async function chartView() {
	let data = await visitorsData();
	const league = document.querySelector("#league").value;
	const week = document.querySelector("#week").value;

	data = data.data[league].visitors[week].visitor;

	return data;
}

let maxCount = 0;

// 가로차트 띄우기
async function widthChart() {
	const chartElem = document.querySelector("#chartDiv");
	chartElem.innerHTML = "";
	chartElem.className = "chart_width";

	const data = await chartView();

	Object.entries(data).forEach(([time, count]) => {
		if (count >= 500) {
			maxCount = 500;
		} else {
			maxCount = count;
		}

		chartElem.innerHTML += `
        <div class="width_parents">
            <p>${time}</p>
            <div class="width" style="width: ${maxCount}px;">${count}명</div>
        </div>`;
	});
}

// 세로차트 띄우기
async function heightChart() {
	const chartElem = document.querySelector("#chartDiv");
	chartElem.innerHTML = "";
	chartElem.className = "chart_height";

	const data = await chartView();

	Object.entries(data).forEach(([time, count]) => {
		if (count >= 500) {
			maxCount = 500;
		} else {
			maxCount = count;
		}

		chartElem.innerHTML += `
        <div class="height_parents">
            <div class="height" style="height: ${maxCount}px;">${count}명</div>
            <p>${time}</p>
        </div>`;
	});
}

async function goodsGroupAdd() {
	const data = await goodsData();

	const goodsGroupList = [...new Set(data.data.map((item) => item.group))];

	const goodsGroupElem = document.querySelector("#goodsGroup");
	goodsGroupElem.innerHTML = "";

	goodsGroupList.forEach((group) => {
		// 굿즈 그룹 체크박스 출력
		goodsGroupElem.innerHTML += `
        <div style="display: flex;">
            <input onchange=""goodsListSort() id="${group}" value="${group}" type="checkbox" checked>
            <p>${group}</p>
        </div>`;
	});
}

async function goodsListSort() {
	const data = await goodsData();
	const sortValue = document.querySelector("#sort").value;
	let goodsSortList;

	const checkboxes = document.querySelectorAll(
		"#goodsGroup input[type='checkbox']"
	);

	const checkedGroups = Array.from(checkboxes)
		.filter((checkbox) => checkbox.checked)
		.map((checkbox) => checkbox.value);

	const filteredGoods = data.data.filter((item) =>
		checkedGroups.includes(item.group)
	);

	if (sortValue == "saleDesc") {
		goodsSortList = [...filteredGoods].sort((a, b) => b.sale - a.sale);
	} else if (sortValue == "saleAsc") {
		goodsSortList = [...filteredGoods].sort((a, b) => a.sale - b.sale);
	} else if (sortValue == "priceDesc") {
		goodsSortList = [...filteredGoods].sort(
			(a, b) =>
				Number(b.price.replace(",", "")) - Number(a.price.replace(",", ""))
		);
	} else if (sortValue == "priceAsc") {
		goodsSortList = [...filteredGoods].sort(
			(a, b) =>
				Number(a.price.replace(",", "")) - Number(b.price.replace(",", ""))
		);
	}

	const goodsListElem = document.querySelector("#goodsList");
	const bestGoodsLestElem = document.querySelector("#bestGoods");

	goodsListElem.innerHTML = "";
	bestGoodsLestElem.innerHTML = "";

	goodsSortList.forEach((item, index) => {
		if (index < 3) {
			goodsListElem.innerHTML += `
                    <div class="card" style="width: 18rem;">
                        <img src="./선수제공파일/B_Module/${item.img}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">[BEST상품]${item.title}</h5>
                            <p>판매량 : ${item.sale}</p>
                            <p>가격 : ${item.price}</p>
                            <p>분류 : ${item.group}</p>
                            <button href="#" class="btn btn-primary w-75" onclick="goodsEdiModal()"     >수정제안</button>
                        </div>
                    </div>
                    </div>
                    `;
		} else {
			goodsListElem.innerHTML += `
                        <div class="card" style="width: 18rem;">
                                <img src="./선수제공파일/B_Module/${item.img}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p>판매량 : ${item.sale}</p>
                                    <p>가격 : ${item.price}</p>
                                    <p>분류 : ${item.group}</p>
                                    <button href="#" class="btn btn-primary w-75" onclick="goodsEdiModal()">수정제안</button>
                                </div>
                            </div>
                        </div>
                    `;
		}
	});
}


function goodsEdiModal() {
    $("#goodsModal").modal("show");
} 