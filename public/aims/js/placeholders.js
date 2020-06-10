/*
	��� ���� ���  �� placeholder  ������� � IE, ��� ������ ������ ������ � ���� form
*/
function placeholders()
{
	if(!($.browser.msie && parseInt($.browser.version)<=9))
		return;

	var forms = $('form');
	if(!forms.size())
		return;

	function blur()
	{
		var input = $(this);

		if(!input.val())
		{
			input.val(input.attr('placeholder'));
			input.css('color', '#959595');
		}
	}

	function focus()
	{
		var input = $(this);

		if(input.val() == input.attr('placeholder'))
		{
			input.val('');
			input.css('color', '');

			return false;
		}

		return true;
	}

	function init()
	{
		var form = $(this);

		var inputs = form.find(':input[placeholder]');
		if(!inputs.size())
			return;

		inputs.each(blur);
		inputs.focus(focus);
		inputs.blur(blur);

		form.submit(function(){inputs.each(focus);});

		var onsubmit = form.attr('onsubmit');

		if(onsubmit)
		{
			eval('function check(){'+onsubmit+';}');

			form.submit(check);
			form.submit(function(){inputs.each(blur)});

			form.removeAttr('onsubmit');
			
			this._submit = this.submit;
			this.submit = function()
			{
				inputs.each(focus);
				
				if(check())
					this._submit();
				else
					inputs.each(blur);
			};
		}
	}

	forms.each(init);
}

$(placeholders);