/*The MIT License (MIT)

Copyright (c) 2015 Santhosh Sasi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function($) {
	'use strict';
	$.fn.maxtable = function(config) {
		var me = $(this);
		genRowHtml(config);
		draw(me, config);
		$(this).data('config', config);
		$(this).click(function(e) {
			clickHandler(me, e, config);
		});
		return this;
	};

	function draw(me, config) {
		var table = $('<table class="super-table">');
		var head = renderHead(config);
		var body = renderBody(config);	
		me.empty();
		table.append(head);
		table.append(body);
		me.append(table);
		adjustHeaders(me);
	}
	
	function adjustHeaders(me) {
		var theadTr =$('thead tr').first(),
			tbodyTr = $('tbody tr').first(),
			ths = theadTr.find('th'),
			tds = tbodyTr.find('td');
		for (var i = 0; i < ths.length; i++) {
			$(ths[i]).css('width', $(tds[i]).css('width'));
		}
	}

	function clickHandler(me, e, config) {
		var startTime = new Date(), timetaken;
		var type = e.target.tagName;
		switch (type) {
			case 'TH':
				
				var field = $(e.target).data('field'),
					sortable = $(e.target).data('sortable'),
					sortDataType = $(e.target).data('type');
				if(sortable !== true) {
					return;
				}
				if(config.sortedBy === field) {
					config.sortDir = config.sortDir? 0 : 1;
				} else {
					config.sortedBy = field;
					config.sortDir = 0;
				}
				config.data.sort(function(a, b) {
					var val1= a[config.sortedBy], val2 = b[config.sortedBy];
					if( val1 === undefined || val1 === null ) {
						val1 = '';
					}
					if( val2 === undefined || val2 === null ) {
						val2 = '';
					}
					if(sortDataType === 'string') {
						val1 = val1.toLowerCase();
						val2 = val2.toLowerCase();
					} else if(sortDataType === 'int'){
						val1 = parseInt(val1);
						val2 = parseInt(val2);
					} else if(sortDataType === 'float'){
						val1 = parseFloat(val1);
						val2 = parseFloat(val2);
					} 

					var retval ;

					if (val1 > val2) {
						retval =  1;
					} else 	if (val1 < val2) {
						retval =  -1;
					} else {
						retval =  0;
					}
					return (config.sortDir? retval * -1 : retval);
				});

				timetaken = Math.abs(new Date() - startTime);
				console.log('timetaken to sort: ', timetaken , ' for ', config.data.length);
				
				draw(me, config);

				timetaken = Math.abs(new Date() - startTime);

				console.log('timetaken: ', timetaken , ' for ', config.data.length);

				break;
			case 'TD':
				break;
		}
	}

	function _v(column, data) {
		var retVal = '';
		if(data[column.field] === undefined || data[column.field] === null) {
			return '';
		}
		return data[column.field];
	}

	function renderHead(config) {
		var head = '<thead><tr>';
		for (var i = 0; i < config.columns.length; i++) {
			head += th(config.columns[i], config);
		}
		head += '<tr></thead>';
		return head;
	}

	function renderBody(config) {
		var ret = '<tbody>';
		for (var i = 0; i < config.data.length; i++) {
			ret += config.data[i].sup_row_html;
		}
		return ret + '</tbody>';
	}

	function genRowHtml(config) {
		var columns = config.columns,
			data = config.data,
			ret = '';
		for (var i = 0; i < data.length; i++) {
			data[i].sup_row_html = tr(columns, data[i]);
		}
	}

	function td(column, row) {
		var widthStr = (column.width ) ? (' style="width: ' + column.width + 'px"') : '';
		var cls = (column.cls) ? ('class="' + column.cls + '"') : '',
			ret = '<td ' + cls + ' ' + widthStr + '>';
		if (column.hasOwnProperty('render')) {
			ret += column['render'](row[column.field], column);
		} else {
			ret += _v(column, row);
		}
		ret += '</td>';
		return ret;
	}

	function th(col, config) {
		var sortIconCls;
		if(col.field === config.sortedBy) {
			sortIconCls = 'sorted' + config.sortDir;
		} else {
			sortIconCls = 'not-sorted' ;
		}
		var clsSort = (col.sortable) ? 'class="sortable ' + sortIconCls +'"' : '',
		sortIcon,
		ret = '<th ' +
			'data-field="' + col.field  + '" ' + 
			'data-sortable="' + (col.sortable ? 'true' : 'false')  + '" ' + 
			'data-type="' + col.type  + '" ' + 
			clsSort + 
			'>';

		if(col.field === config.sortedBy) {
			sortIcon = ' <div class="sorted' + config.sortDir + '"></div>' ;
		} else {
			sortIcon = ' <div class="not-sorted' + config.sortDir + '"></div>' ;
		}
		ret += col.label ;
		ret += '</th>';
		return ret;
	}

	function tr(columns, row) {
		var ret = '<tr>';
		for (var i = 0; i < columns.length; i++) {
			ret += td(columns[i], row);
		}
		ret += '</tr>';
		return ret;
	}


})(jQuery);