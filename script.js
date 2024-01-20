let datas = [{ 'name': "Repo-1", 'id': "card", 'visible': true }];

const searchInput = document.getElementById("search");

$(function () {
    var original = $("#card");
    var cont = $("#cards");
    var data = 100;
    var limit = 10;
    var paginationsize = 7;
    var current = 1;
    var totalpage;

    for (var i = 2; i <= data; i++) {
        var clone = original.clone();

        clone.attr('id', 'card' + i);
        clone.find('h1').text('Repo-' + i);
        datas.push({ 'name': 'Repo-' + i, 'id': 'card' + i, 'visible': true });
        clone.appendTo(cont);
    }

    // Event listener for input changes in the search bar
    searchInput.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();

        // Update data based on search value
        datas.forEach(dt => {
            dt.visible = dt.name.toLowerCase().includes(value);
        });

        // Update pagination and show the first page
        updatePagination();
        showpage(1);
    });

    // Function to update pagination based on the visible cards
    function updatePagination() {
        var visibleCards = datas.filter(dt => dt.visible);
        var noi = visibleCards.length;
        totalpage = Math.ceil(noi / limit);

        $(".pagination li").slice(1, -1).remove();

        list(totalpage, current, paginationsize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
                .append($("<a>").addClass("page-link").toggleClass("actives", item === current)
                    .attr({ href: "javascript:void(0)" }).text(item || "...")).insertBefore(".next-page");
        });

        $(".previous-page a").toggleClass("disable", current === 1);
        $(".next-page a").toggleClass("disable", current === totalpage);
    }

    // Function to show a specific page of visible cards
    function showpage(wp) {
        if (wp < 1 || wp > totalpage) return false;

        current = wp;

        var visibleCards = datas.filter(dt => dt.visible);
        var startIndex = (current - 1) * limit;
        var endIndex = current * limit;
        var currentVisibleCards = visibleCards.slice(startIndex, endIndex);
        var visibleCards = datas.filter(dt => dt.visible);
        var noi = visibleCards.length;
        totalpage = Math.ceil(noi / limit);

        $(".pagination li").slice(1, -1).remove();

        list(totalpage, current, paginationsize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
                .append($("<a>").addClass("page-link").toggleClass("actives", item === current)
                    .attr({ href: "javascript:void(0)" }).text(item || "...")).insertBefore(".next-page");
        });

        $(".previous-page a").toggleClass("disable", current === 1);
        $(".next-page a").toggleClass("disable", current === totalpage);
        
        $(".cards .cds").hide();
        currentVisibleCards.forEach(dt => {
            $('#' + dt.id).show();
        });

        return true;
    }

    // Function to generate a range of numbers
    function range(st, end) {
        return Array.from(Array(end - st + 1), (_, i) => i + st);
    }

    // Function to calculate the pagination list
    function list(totalpage, page, max) {
        var sidew = max < 9 ? 1 : 2;
        var leftw = (max - sidew * 2 - 3) >> 1;
        var rightw = (max - sidew * 2 - 3) >> 1;

        if (totalpage <= max) {
            return range(1, totalpage);
        }

        if (page <= max - sidew - 1 - rightw) {
            return range(1, max - sidew - 1).concat(0, range(totalpage - sidew + 1, totalpage));
        }

        if (page >= totalpage - sidew - 1 - rightw) {
            return range(1, sidew).concat(0, range(totalpage - sidew - 1 - rightw - leftw, totalpage));
        }

        return range(1, sidew).concat(0, range(page - leftw, page + rightw), 0, range(totalpage - sidew + 1, totalpage));
    }

    // Add pagination elements
    $(".pagination").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("Next"))
    );

    // Show the first page initially
    $(".cards").show();
    updatePagination();
    showpage(1);

    // Event listeners for pagination
    $(document).on("click", ".pagination li.current-page:not(.actives)", function () {
        return showpage(+$(this).text());
    });

    $(".next-page").on("click", function () {
        return showpage(current + 1);
    });

    $(".previous-page").on("click", function () {
        return showpage(current - 1);
    });
});
