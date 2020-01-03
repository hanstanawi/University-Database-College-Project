$(document).ready(function(){
    $(".delete-record").on('click', function(){
        var id = $(this).data('id');
        var url = 'students/delete/'+id;
        if(confirm('Delete Record?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Record');
                    window.location.href='/students';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    $("#student-search-button").on('click', function(){
        var str = $('#student-search-input').val();
        var url = '/students/search/'+str;
        window.location.href = url;
      
    });

    $('.edit').on('click', function(){
        $('#edit-form-name').val($(this).data('name'));
        $('#edit-form-bdate').val($(this).data('bdate'));
        $('#edit-form-sex').val($(this).data('sex'));
        $('#edit-form-email').val($(this).data('email'));
        $('#edit-form-phone').val($(this).data('phone'));
        $('#edit-form-department_id').val($(this).data('department_id'));
        $('#edit-form-photo').val($(this).data('photo'));
        $('#edit-form-sid').val($(this).data('sid'));
    });
});