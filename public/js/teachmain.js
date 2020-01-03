$(document).ready(function(){
    $(".delete-record").on('click', function(){
        var id = $(this).data('id');
        var url = '/teaches/delete/'+id;
        if(confirm('Delete Record?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Record');
                    window.location.href='/teaches';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    $('.edit').on('click', function(){
        $('#edit-form-course_id').val($(this).data('course_id'));
        $('#edit-form-teacher_name').val($(this).data('teacher_name'));
        $('#edit-form-course_name').val($(this).data('course_name'));
        $('#edit-form-teacher_id').val($(this).data('teacher_id'));
    });
});