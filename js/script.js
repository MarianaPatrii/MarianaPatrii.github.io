$(document).ready(function () {

    var options = {
        from: 0,
        limit: 12,
        pokeitems: '.pokeitems',
        pokeitem: '.pokeitem',
        pokemon: '.pokemon',
        buttonMore: '.btn-more button',
        pokeitemsWrapper: '#pokeitems-wrapper',
        pokeitemWrapper: '.pokeitem-wrapper',
        filterCategoryButton: '.category-item',
        message: '.message'
    };

    //On just loaded page hide info about particular pokemon
    $(options.pokemon).hide();

    // Get Pokemon items
    getPokemonItems(options.from, options.limit);

    // On Pokemon item click load Pokemon info
    $(options.pokeitems).on('click', options.pokeitem, function () {
        getPokemon($(this).data('id'));
    });

    // On button more click load more pokemons
    $(options.buttonMore).on('click', function () {
        options.from += options.limit;
        options.limit += options.limit;
        getPokemonItems(options.from, options.limit);
    });

    // Filter pokemons
    $(options.pokeitems).on('click', options.filterCategoryButton, function () {
        filterPokeItems($(this).attr('id'));
    });


// FUNCTIONS

    // Filter Pokemon items
    function filterPokeItems(category) {
        $(options.message).hide();
        const selector = $('.types>span.' + category);
        if (category === 'all') {
            $(options.pokeitemWrapper).hide();
            getPokemonItems(options.from, options.limit);
        } else {
            $(options.pokeitemWrapper).hide();
            if (selector.length === 0) {
                $(options.message).show();
            }
            selector.parents(options.pokeitemWrapper).show();
        }
    }

    //Get info from PokeAPI about particular pokemon
    function getPokemon($id) {
        $(options.pokeitem).on('click', function () {
            $(options.pokemon).show();
        });

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'https://pokeapi.co/api/v2/pokemon/' + $id + '/',
            success: function (data) {
                // console.log(data);
                let pokeTypes = [];

                $.each(data.types, function (key, val) {
                    pokeTypes.push(val.type.name);
                });

                $('.avatar-big img').attr('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.id + '.png');
                $('.type').text(pokeTypes.join(", "));
                $('.pokemon-name').text(data.name + " #" + data.id);
                $('.attack').text(data.stats[4].base_stat);
                $('.defense').text(data.stats[3].base_stat);
                $('.hp').text(data.stats[5].base_stat);
                $('.sp_atk').text(data.stats[2].base_stat);
                $('.sp_def').text(data.stats[1].base_stat);
                $('.speed').text(data.stats[0].base_stat);
                $('.weight').text(data.weight);
                $('.moves').text(data.moves.length);
                if ($(options.pokemon).is(':hidden')) {
                    $(options.pokemon).show();
                }
            },
        });
    }


    // Get Pokemon items
    function getPokemonItems(from, to) {
        $(options.message).hide();

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'https://pokeapi.co/api/v2/pokemon/',
            success: function (data) {
                console.log('ajax: ', data);
                $.each(data.results.slice(from, to), function (key, val) {
                    let items = [];
                    let types = [];

                    $.get(val.url, function (result) {
                        $.each(result.types, function (key, val) {
                            types.push('<span class="label label-default ' + val.type.name + '">' + val.type.name + '</span>');
                        });
                        items.push(
                            `<div class="pokeitem-wrapper col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                    <div class="pokeitem" data-id="${result.id}">
                                        <p class="avatar"><img src="${result.sprites.front_default }" /></p>
                                        <h3 class="name">${result.name}</h3>
                                        <p class="types">${types.join(" ")}</p>
                                    </div>
                                </div>`
                        );
                        $(options.pokeitemsWrapper).append(items.join(''));
                    }, 'json');
                });
            }
        });
    }

});
