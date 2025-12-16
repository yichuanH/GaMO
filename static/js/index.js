window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    
    // ==========================================
    // 1. 原有的 Bulma Carousel 設定 (保留)
    // ==========================================
    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    }
    // Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
    bulmaSlider.attach();


    // ==========================================
    // 2. 影片滑動比較邏輯 (Teaser Videos)
    // ==========================================
    function initVideoSliders() {
        $('.comparison-container').each(function() {
            var $container = $(this);
            var $slider = $container.find('.slider-control');
            var $videoOurs = $container.find('.video-ours'); 
            
            var position = 0.5;
            updateSlider(position);

            var isDragging = false;

            $slider.on('mousedown touchstart', function(e) {
                isDragging = true;
                e.preventDefault();
            });

            $(window).on('mouseup touchend', function() {
                isDragging = false;
            });

            $(window).on('mousemove touchmove', function(e) {
                if (!isDragging) return;
                
                var pageX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
                var offset = $container.offset();
                var width = $container.width();
                
                var x = pageX - offset.left;
                position = Math.max(0, Math.min(1, x / width));
                
                updateSlider(position);
            });

            function updateSlider(pos) {
                var percent = pos * 100;
                $slider.css('left', percent + '%');
                $videoOurs.css('clip-path', `inset(0 0 0 ${percent}%)`);
            }
        });
    }
    initVideoSliders();


    // ==========================================
    // 3. 圖片滑動比較 (Outpainting - Hover模式)
    // ==========================================
    $('.img-slider-container').on('mousemove touchmove', function(e) {
        var offset = $(this).offset();
        var width = $(this).width();
        
        var pageX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
        
        var x = pageX - offset.left;
        var percent = (x / width) * 100;
        
        percent = Math.max(0, Math.min(100, percent));

        $(this).find('.img-slider-control').css('left', percent + '%');
        $(this).find('.img-ours').css('clip-path', `inset(0 0 0 ${percent}%)`);
    });


    // ==========================================
    // 4. 縮圖點擊切換圖片 (已修正檔名判斷邏輯)
    // ==========================================
    $(document).on('click', '.thumb-item', function() {
        var $clickedThumb = $(this);
        var $wrapper = $clickedThumb.closest('.img-comp-wrapper');

        $wrapper.find('.thumb-item').removeClass('active');
        $clickedThumb.addClass('active');

        var scenePath = $wrapper.data('scene-path'); 
        var method = $wrapper.data('method');        
        var imgId = $clickedThumb.data('id');        

        var filenamePrefix;
        if (String(imgId).startsWith('DSC')) {
            filenamePrefix = imgId;
        } else {
            filenamePrefix = 'rgb_' + imgId;
        }

        var oursSrc = `static/images/outpaint/${scenePath}/ours/${filenamePrefix}_b.png`;
        var methodSrc = `static/images/outpaint/${scenePath}/${method}/${filenamePrefix}_b.png`;

        $wrapper.find('.img-ours').attr('src', oursSrc);
        $wrapper.find('.img-method').attr('src', methodSrc);
    });

    // ==========================================
    // 6. 左右箭頭切換圖片功能 (新增)
    // ==========================================
    $(document).on('click', '.img-nav-button', function(e) {
        e.stopPropagation(); 
        e.preventDefault();

        var $btn = $(this);
        var $wrapper = $btn.closest('.img-comp-wrapper');
        var $thumbs = $wrapper.find('.thumb-item'); 
        var $activeThumb = $wrapper.find('.thumb-item.active'); 
        
        var currentIndex = $thumbs.index($activeThumb);
        var nextIndex;

        if ($btn.hasClass('next-btn')) {
            nextIndex = (currentIndex + 1) % $thumbs.length;
        } else {
            nextIndex = (currentIndex - 1 + $thumbs.length) % $thumbs.length;
        }

        $thumbs.eq(nextIndex).click();
    });

    // ==========================================
    // 5. 方法切換按鈕 (修正標題與作者)
    // ==========================================
    $('.outpainting-button').click(function() {
        var method = $(this).data('outpainting-method'); 
        
        // 1. 切換按鈕狀態
        $('.outpainting-button').removeClass('active');
        $(this).addClass('active');

        // 2. 切換場景顯示
        $('.outpainting-scenes').removeClass('active').hide();
        $('#' + method + '-scenes').addClass('active').css('display', 'grid');
        
        // 3. 定義正確的資料 (含作者縮寫)
        var data = {
            'mvgenmaster': {
                title: "Scaling Multi-View Generation from Any Image via 3D Priors Enhanced Diffusion Model",
                authors: "C. Cao, C. Yu, S. Liu, F. Wang, X. Xue, Y. Fu",
                venue: "CVPR 2025"
            },
            'seva': {
                title: "Stable Virtual Camera: Generative View Synthesis with Diffusion Models",
                authors: "J. Zhou, H. Gao, V. Voleti, A. Vasishta, C.-H. Yao, M. Boss, P. Torr, C. Rupprecht, V. Jampani",
                venue: "arXiv 2025"
            }
        };

        var currentInfo = data[method];
        var $infoBlock = $('#method-info-outpainting');

        // 更新標題與會議
        $infoBlock.find('.method-info-title').text(currentInfo.title);
        $infoBlock.find('.method-info-venue').text(currentInfo.venue);

        // 更新作者 (如果 HTML 裡沒有 authors div，自動補上)
        var $authors = $infoBlock.find('.method-info-authors');
        if ($authors.length === 0) {
            $authors = $('<div class="method-info-authors"></div>');
            $infoBlock.find('.method-info-title').after($authors);
        }
        $authors.text(currentInfo.authors);
    });

});