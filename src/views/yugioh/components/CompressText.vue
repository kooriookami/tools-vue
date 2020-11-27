<script>
    export default {
        name: 'CompressText',
        props: ['text', 'width', 'height', 'language', 'autoSizeElement'],
        render() {
            let domList = this.text.replace(/\[.*?\(.*?\)]/g, s => `|${s}|`).split('|').filter(value => value).map(value => {
                if (/\[.*?\(.*?\)]/g.test(value)) {
                    let ruby = value.replace(/\[(.*?)\((.*?)\)]/g, '$1');
                    let rt = value.replace(/\[(.*?)\((.*?)\)]/g, '$2');
                    return <span class="ruby">{ruby}<span class="rt" v-compress-rt>{rt}</span></span>;
                }
                return value;
            });
            let params = {
                width: this.width,
                height: this.height,
                language: this.language,
                autoSizeElement: this.autoSizeElement   // 英文语言下压缩到一定程度，字体缩小的元素
            };
            return <span v-compress-text={params}>{domList}</span>;
        },
        directives: {
            // 压缩或拉伸注音文字
            compressRt(el) {
                let ruby = el.parentNode;
                let rt = el;
                rt.classList.remove('justify');
                ruby.style.margin = '';
                rt.style.transform = '';
                rt.style.left = '';

                let text = ruby.innerText.split('\n')[0];
                let rubyWidth = ruby.offsetWidth;
                let rtWidth = rt.offsetWidth;
                if (rtWidth / rubyWidth < 0.9 && text.length > 1) {
                    // 拉伸两端对齐
                    rt.classList.add('justify');
                } else if (rtWidth > rubyWidth) {
                    // 压缩
                    if (rubyWidth / rtWidth < 0.6) {
                        // 防止过度压缩，加宽ruby
                        // 公式：(rubyWidth + widen) / rtWidth = 0.6
                        let widen = 0.6 * rtWidth - rubyWidth;
                        ruby.style.margin = `0 ${widen / 2}px`;
                        rt.style.transform = `scaleX(${(rubyWidth + widen) / rtWidth})`;
                        rt.style.left = `${-widen / 2}px`;
                    } else {
                        rt.style.transform = `scaleX(${rubyWidth / rtWidth})`;
                    }
                } else {
                    // 不变并居中
                    rt.style.left = `${(rubyWidth - rtWidth) / 2}px`;
                }
            },
            // 压缩文本文字
            compressText(el, binding) {
                let params = binding.value;
                if (params.width && params.height) {
                    el.style.display = 'inline-block';
                    el.style.width = `${params.width}px`;
                    el.style.transform = '';
                    el.style.transformOrigin = '0 0';

                    let autoSizeElement = document.querySelector(params.autoSizeElement);
                    autoSizeElement?.classList.remove('small-description');

                    if (el.clientHeight > params.height) {
                        // 用二分法获取最大的scale，精度0.01
                        let scale = 0.5;
                        let start = 0;
                        let end = 1;
                        while (scale > 0) {
                            scale = (start + end) / 2;
                            el.style.width = `${params.width / scale}px`;
                            el.style.transform = `scaleX(${scale})`;
                            el.clientHeight > params.height ? end = scale : start = scale;
                            if (el.clientHeight <= params.height && end - start <= 0.005) {
                                // 如果是英文，灵摆和效果栏字体判断缩小
                                if (params.language === 'en' && params.autoSizeElement && scale < 0.7) {
                                    // 防止死循环
                                    if (autoSizeElement?.classList.contains('small-description')) {
                                        break;
                                    } else {
                                        autoSizeElement?.classList.add('small-description');
                                        scale = 0.5;
                                        start = 0;
                                        end = 1;
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    };
</script>

<style lang="scss">
    .ruby {
        position: relative;

        .rt {
            font-family: ygo-tip, sans-serif;
            font-size: 16px;
            font-weight: bold;
            position: absolute;
            left: 0;
            text-align: center;
            white-space: pre;
            letter-spacing: 0;
            text-indent: 0;
            transform-origin: 0 0;

            &.justify {
                text-align-last: justify;
                left: 5%;
                width: 90%;
            }
        }
    }
</style>