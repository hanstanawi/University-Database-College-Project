$(document).ready(function(){
    $(".delete-record").on('click', function(){
        var id = $(this).data('id');
        var url = '/takes/delete/'+id;
        if(confirm('Delete Record?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Record');
                    window.location.href='/takes';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    $('.edit').on('click', function(){
        $('#edit-form-course_id').val($(this).data('course_id'));
        $('#edit-form-student_name').val($(this).data('student_name'));
        $('#edit-form-course_name').val($(this).data('course_name'));
        $('#edit-form-sid').val($(this).data('sid'));
    });
});