import uuid
import random
from flask import Flask, request, jsonify
import boto3
from boto3.dynamodb.conditions import Attr 
from botocore.exceptions import ClientError
import os
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Read environment variables for DynamoDB table names
QUESTION_TABLE_NAME = os.environ['QUESTION_TABLE_NAME']
QUIZ_TABLE_NAME = os.environ['QUIZ_TABLE_NAME']

# DynamoDB configuration
dynamodb = boto3.resource('dynamodb')

# Initialize DynamoDB tables
trivia_question_table = dynamodb.Table(QUESTION_TABLE_NAME)
trivia_quiz_table = dynamodb.Table(QUIZ_TABLE_NAME)

# Function to get questions by category from the question table
def get_questions_by_category(category):
    try:
        response = trivia_question_table.scan(FilterExpression=Attr('category').eq(category))
        return response['Items']
    except ClientError as e:
        return None

# Function to add a new question to the question table
@app.route('/add_question', methods=['POST'])
def add_question():
    data = request.json

    question_id = str(uuid.uuid4())  # Generate the question_id
    question_text = data.get('question_text')
    option1 = data.get('option1')
    option2 = data.get('option2')
    option3 = data.get('option3')
    option4 = data.get('option4')
    answer = data.get('answer')
    category = data.get('category')

    try:
        response = trivia_question_table.put_item(
            Item={
                'question_id': question_id,
                'question_text': question_text,
                'option1': option1,
                'option2': option2,
                'option3': option3,
                'option4': option4,
                'answer': answer,
                'category': category
            }
        )
        return jsonify({"message": "Question added successfully!", "question_id": question_id}), 201
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

# Function to update an existing question in the question table
@app.route('/update_question/<string:question_id>', methods=['PUT'])
def update_question(question_id):
    data = request.json

    question_text = data.get('question_text')
    option1 = data.get('option1')
    option2 = data.get('option2')
    option3 = data.get('option3')
    option4 = data.get('option4')
    answer = data.get('answer')
    category = data.get('category')

    try:
        response = trivia_question_table.update_item(
            Key={'question_id': question_id},
            UpdateExpression='SET question_text = :question_text, option1 = :option1, '
                             'option2 = :option2, option3 = :option3, option4 = :option4, '
                             'answer = :answer, category = :category',
            ExpressionAttributeValues={
                ':question_text': question_text,
                ':option1': option1,
                ':option2': option2,
                ':option3': option3,
                ':option4': option4,
                ':answer': answer,
                ':category': category
            }
        )
        return jsonify({"message": "Question updated successfully!"}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

# Function to delete a question from the question table
@app.route('/delete_question/<string:question_id>', methods=['DELETE'])
def delete_question(question_id):
    try:
        response = trivia_question_table.delete_item(
            Key={'question_id': question_id}
        )
        return jsonify({"message": "Question deleted successfully!"}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

# Function to create a new quiz with questions from a specific category
@app.route('/create_quiz_from_category', methods=['POST'])
def create_quiz_from_category():
    data = request.json

    quiz_id = str(uuid.uuid4())
    quiz_name = data.get('quiz_name')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    quiz_category = data.get('quiz_category')
    difficulty_level = data.get('difficulty_level')
    total_points = data.get('total_points')
    quiz_description = data.get('quiz_description')
    total_num_questions = int(data.get('total_num_questions'))  # Convert to integer

    # Fetch questions from the selected category
    questions = get_questions_by_category(quiz_category)

    if not questions:
        return jsonify({"error": "No questions found in the selected category!, please add the questions in the selected category first"}), 404

    # Check if the total number of questions is greater than the available questions in the category
    if total_num_questions > len(questions):
        return jsonify({"error": "Insufficient questions in the category. Add more questions first."}), 500

    # Randomly pick questions for the quiz
    selected_questions = random.sample(questions, total_num_questions)

    # Extract question_ids from the selected questions list
    question_ids = [question['question_id'] for question in selected_questions]

    # Initialize the "players" field as an empty array
    players = []

    try:
        response = trivia_quiz_table.put_item(
            Item={
                'quiz_id': quiz_id,
                'quiz_name': quiz_name,
                'start_date': start_date,
                'end_date': end_date,
                'quiz_category': quiz_category,
                'difficulty_level': difficulty_level,
                'total_points': total_points,
                'quiz_description': quiz_description,
                'total_num_questions': total_num_questions,
                'questions': question_ids,
                'players': players  # Add the "players" field
            }
        )
        post_data = {
            "quizname": quiz_name,
            "quizcategory": quiz_category,
            "difficultylevel": difficulty_level,
            "start_date": start_date,
            "end_date": end_date
        }
        response = requests.post("https://vvfl00tya8.execute-api.us-east-1.amazonaws.com/newgamemessage",json=post_data)
        print(response)

        return jsonify({"message": "Quiz created successfully!", "quiz_id": quiz_id}), 201
    except ClientError as e:
        return jsonify({"error": str(e)}), 500
    

# Function to list quizzes based on optional parameters
@app.route('/list_quizzes', methods=['GET'])
@app.route('/list_quizzes/<string:difficulty_level>', methods=['GET'])
@app.route('/list_quizzes/<string:difficulty_level>/<string:category>', methods=['GET'])
def list_quizzes(difficulty_level=None, category=None):
    try:
        if difficulty_level and category:
            filter_expression = Attr('quiz_category').eq(category) & Attr('difficulty_level').eq(difficulty_level)
        elif difficulty_level:
            filter_expression = Attr('difficulty_level').eq(difficulty_level)
        elif category:
            filter_expression = Attr('quiz_category').eq(category)
        else:
            response = trivia_quiz_table.scan()
            quizzes = response['Items']
            return jsonify({"quizzes": quizzes}), 200

        response = trivia_quiz_table.scan(FilterExpression=filter_expression)
        quizzes = response['Items']
        return jsonify({"quizzes": quizzes}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

# Function to get all questions from the question table
@app.route('/get_all_questions', methods=['GET'])
def get_all_questions():
    try:
        response = trivia_question_table.scan()
        questions = response['Items']
        if not questions:
            return jsonify({"error": "No questions found!"}), 404
        return jsonify({"questions": questions}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500    
    
# Function to get a question by its question_id from the question table
@app.route('/get_question/<string:question_id>', methods=['GET'])
def get_question(question_id):
    try:
        response = trivia_question_table.get_item(Key={'question_id': question_id})
        question = response.get('Item')
        if not question:
            return jsonify({"error": "Question not found!"}), 404
        return jsonify({"question": question}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

# Function to edit a quiz by its quiz_id in the quiz table
@app.route('/edit_quiz/<string:quiz_id>', methods=['PUT'])
def edit_quiz(quiz_id):
    data = request.json

    quiz_name = data.get('quiz_name')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    quiz_category = data.get('quiz_category')
    difficulty_level = data.get('difficulty_level')
    total_points = data.get('total_points')
    quiz_description = data.get('quiz_description')
    total_num_questions = int(data.get('total_num_questions'))  # Convert to integer

    # Fetch questions from the selected category
    questions = get_questions_by_category(quiz_category)

    if not questions:
        return jsonify({"error": "No questions found in the selected category!"}), 404

    # Check if the total number of questions is greater than the available questions in the category
    if total_num_questions > len(questions):
        return jsonify({"error": "Insufficient questions in the category. Add more questions first."}), 500

    # Randomly pick questions for the quiz
    selected_questions = random.sample(questions, total_num_questions)

    # Extract question_ids from the selected questions list
    question_ids = [question['question_id'] for question in selected_questions]

    try:
        response = trivia_quiz_table.update_item(
            Key={'quiz_id': quiz_id},
            UpdateExpression='SET quiz_name = :quiz_name, start_date = :start_date, '
                             'end_date = :end_date, quiz_category = :quiz_category, '
                             'difficulty_level = :difficulty_level, total_points = :total_points, '
                             'quiz_description = :quiz_description, questions = :questions, '
                             'total_num_questions = :total_num_questions',  # Update total_num_questions
            ExpressionAttributeValues={
                ':quiz_name': quiz_name,
                ':start_date': start_date,
                ':end_date': end_date,
                ':quiz_category': quiz_category,
                ':difficulty_level': difficulty_level,
                ':total_points': total_points,
                ':quiz_description': quiz_description,
                ':questions': question_ids,
                ':total_num_questions': total_num_questions  # Set the updated total_num_questions
            }
        )
        return jsonify({"message": "Quiz updated successfully!"}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500
    
# Function to delete a quiz by its quiz_id from the quiz table
@app.route('/delete_quiz/<string:quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    try:
        response = trivia_quiz_table.delete_item(
            Key={'quiz_id': quiz_id}
        )
        return jsonify({"message": "Quiz deleted successfully!"}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500
    
# Function to get questions in a particular quiz
@app.route('/get_quiz_questions/<string:quiz_id>', methods=['GET'])
def get_quiz_questions(quiz_id):
    try:
        # Retrieve the quiz from the quiz table
        response = trivia_quiz_table.get_item(Key={'quiz_id': quiz_id})
        quiz = response.get('Item')
        
        if not quiz:
            return jsonify({"error": "Quiz not found!"}), 404
        
        # Retrieve the question_ids associated with the quiz
        question_ids = quiz.get('questions', [])
        
        # Retrieve the questions from the question table using the question_ids
        questions = []
        for question_id in question_ids:
            response = trivia_question_table.get_item(Key={'question_id': question_id})
            question = response.get('Item')
            if question:
                questions.append(question)
        
        return jsonify({"quiz_id": quiz_id, "questions": questions}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/add_user_to_quiz', methods=['POST'])
def add_user_to_quiz():
    data = request.json
    user_id = data.get('user_id')
    quiz_id = request.args.get('quiz_id')

    try:
        # Update the quiz with the new user_id in the "players" array
        response = trivia_quiz_table.update_item(
            Key={'quiz_id': quiz_id},
            UpdateExpression='SET players = list_append(if_not_exists(players, :empty_list), :user_id)',
            ExpressionAttributeValues={
                ':user_id': [user_id],
                ':empty_list': []  # Initialize an empty list if "players" attribute doesn't exist
            }
        )

        return jsonify({"message": "User added to the quiz successfully!"}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_quiz_players/<string:quiz_id>', methods=['GET'])
def get_quiz_players(quiz_id):
    try:
        # Retrieve the quiz from the quiz table
        response = trivia_quiz_table.get_item(Key={'quiz_id': quiz_id})
        quiz = response.get('Item')

        if not quiz:
            return jsonify({"error": "Quiz not found!"}), 404

        # Retrieve the "players" array from the quiz
        players = quiz.get('players', [])

        return jsonify({"quiz_id": quiz_id, "players": players}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500

# Function to get details of a quiz by its quiz_id from the quiz table
@app.route('/get_quiz_details/<string:quiz_id>', methods=['GET'])
def get_quiz_details(quiz_id):
    try:
        # Retrieve the quiz from the quiz table
        response = trivia_quiz_table.get_item(Key={'quiz_id': quiz_id})
        quiz = response.get('Item')

        if not quiz:
            return jsonify({"error": "Quiz not found!"}), 404

        # Extract the quiz details
        quiz_details = {
            "quiz_id": quiz_id,
            "quiz_name": quiz.get('quiz_name'),
            "start_date": quiz.get('start_date'),
            "end_date": quiz.get('end_date'),
            "quiz_category": quiz.get('quiz_category'),
            "difficulty_level": quiz.get('difficulty_level'),
            "total_points": quiz.get('total_points'),
            "quiz_description": quiz.get('quiz_description'),
            "total_num_questions": quiz.get('total_num_questions'),
            "players": quiz.get('players', []),
            "questions": []  # We'll populate this with question details later
        }

        # Retrieve the question_ids associated with the quiz
        question_ids = quiz.get('questions', [])

        # Retrieve the questions from the question table using the question_ids
        questions = []
        for question_id in question_ids:
            response = trivia_question_table.get_item(Key={'question_id': question_id})
            question = response.get('Item')
            if question:
                questions.append(question)

        # Populate the quiz_details with question details
        quiz_details['questions'] = questions

        return jsonify(quiz_details), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)